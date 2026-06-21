import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSociaVault, NormalizedSound } from "@/lib/sociavault";
import { Locale } from "@/generated/prisma";

// Vercel Cron: Run daily at 3 AM UTC
// Configure in vercel.json: "crons": [{ "path": "/api/cron/sync-sounds", "schedule": "0 3 * * *" }]

// Markets to sync - SociaVault supports country codes for music
const MARKETS_TO_SYNC: { locale: Locale; countryCode: string }[] = [
  { locale: "US", countryCode: "US" },
  { locale: "UK", countryCode: "GB" },
];

// Thresholds for viral/trending detection
const VIRAL_THRESHOLD = 100000; // 100k+ videos
const TRENDING_VELOCITY_THRESHOLD = 50; // 50%+ velocity increase

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const results: Record<string, { processed: number; failed: number }> = {};

  try {
    const sociaVault = getSociaVault();

    for (const { locale, countryCode } of MARKETS_TO_SYNC) {
      let processed = 0;
      let failed = 0;

      // Create ingestion job record
      const job = await prisma.dataIngestionJob.create({
        data: {
          type: "sounds",
          locale,
          status: "running",
          startedAt: new Date(),
        },
      });

      try {
        console.log(`[Sync Sounds] Fetching popular sounds for country: ${countryCode}`);
        console.log(`[Sync Sounds] API Key present: ${!!process.env.SOCIAVAULT_API_KEY}`);
        console.log(`[Sync Sounds] API Key length: ${process.env.SOCIAVAULT_API_KEY?.length || 0}`);

        // Fetch popular sounds from SociaVault
        // Note: This endpoint can take up to 30 seconds to respond
        const response = await sociaVault.getPopularSounds({
          page: 1,
          timePeriod: "7", // Last 7 days
          rankType: "popular",
          countryCode,
        });

        console.log(`[Sync Sounds] Got ${response.sounds.length} sounds for ${countryCode}`);
        console.log(`[Sync Sounds] Response hasMore: ${response.hasMore}, total: ${response.total}`);

        for (const sound of response.sounds) {
          try {
            await upsertSound(sound, locale);
            processed++;
          } catch (error) {
            console.error(`Failed to process sound ${sound.sound_id}:`, error);
            failed++;
          }
        }

        // Also fetch "surging" sounds (rapidly growing)
        try {
          const surgingResponse = await sociaVault.getPopularSounds({
            page: 1,
            timePeriod: "7",
            rankType: "surging",
            countryCode,
          });

          console.log(`[Sync Sounds] Got ${surgingResponse.sounds.length} surging sounds for ${countryCode}`);

          for (const sound of surgingResponse.sounds) {
            // Check if we already processed this sound
            const exists = await prisma.sound.findUnique({
              where: { externalId: sound.sound_id },
            });

            if (!exists) {
              try {
                await upsertSound(sound, locale);
                processed++;
              } catch (error) {
                console.error(`Failed to process surging sound ${sound.sound_id}:`, error);
                failed++;
              }
            }
          }
        } catch (surgingError) {
          console.error(`Failed to fetch surging sounds for ${countryCode}:`, surgingError);
        }

        // Update job status
        await prisma.dataIngestionJob.update({
          where: { id: job.id },
          data: {
            status: "completed",
            itemsProcessed: processed,
            itemsFailed: failed,
            completedAt: new Date(),
          },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error(`Failed to sync sounds for ${locale}:`, errorMessage);
        console.error(`[Sync Sounds] Error stack:`, errorStack);

        await prisma.dataIngestionJob.update({
          where: { id: job.id },
          data: {
            status: "failed",
            itemsProcessed: processed,
            itemsFailed: failed,
            errorMessage,
            completedAt: new Date(),
          },
        });

        failed = -1;
      }

      results[locale] = { processed, failed };
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      results,
    });
  } catch (error) {
    console.error("Sound sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync sounds" },
      { status: 500 }
    );
  }
}

async function upsertSound(
  sound: NormalizedSound,
  locale: Locale
) {
  const externalId = sound.sound_id;
  const rank = sound.rank;

  // Find existing sound
  const existing = await prisma.sound.findUnique({
    where: { externalId },
  });

  // Calculate velocity (videos per day) based on previous data
  let videoVelocity = 0;
  let velocityChange = 0;
  let videoCount = sound.video_count || 0;

  // If we have trend data, estimate video count from the trend
  if (sound.trend_data && sound.trend_data.length > 0) {
    // Trend data contains normalized values (0-1), estimate relative growth
    const recentTrend = sound.trend_data[sound.trend_data.length - 1]?.value || 0;
    const oldTrend = sound.trend_data[0]?.value || 0;
    if (oldTrend > 0) {
      velocityChange = ((recentTrend - oldTrend) / oldTrend) * 100;
    }
  }

  if (existing) {
    // Get last snapshot to calculate velocity
    const lastSnapshot = await prisma.soundSnapshot.findFirst({
      where: { soundId: existing.id },
      orderBy: { snapshotDate: "desc" },
    });

    if (lastSnapshot && videoCount > 0) {
      const daysSinceSnapshot = Math.max(
        1,
        (Date.now() - lastSnapshot.snapshotDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const videoDiff = videoCount - lastSnapshot.videoCount;
      videoVelocity = videoDiff / daysSinceSnapshot;

      // Calculate velocity change percentage
      if (lastSnapshot.videoVelocity > 0) {
        velocityChange = ((videoVelocity - lastSnapshot.videoVelocity) / lastSnapshot.videoVelocity) * 100;
      }
    }
  }

  // Calculate rank change
  const previousRank = existing?.currentRank ?? null;
  const rankChange = sound.rank_change ?? (previousRank ? previousRank - rank : 0);

  // Determine viral/trending status
  const isViral = videoCount >= VIRAL_THRESHOLD;
  const isTrending = velocityChange >= TRENDING_VELOCITY_THRESHOLD || (sound.rank_change !== undefined && sound.rank_change > 0);

  // Calculate daily video count (videos created today)
  const dailyVideoCount = Math.max(0, Math.round(videoVelocity));

  // Upsert sound
  const upsertedSound = await prisma.sound.upsert({
    where: { externalId },
    create: {
      externalId,
      locale,
      title: sound.title,
      authorName: sound.author,
      duration: sound.duration,
      coverUrl: sound.cover_url,
      audioUrl: sound.link, // TikTok music page URL
      videoCount,
      dailyVideoCount,
      currentRank: rank,
      previousRank,
      rankChange,
      videoVelocity,
      velocityChange,
      isViral,
      isTrending,
      lastUpdatedAt: new Date(),
    },
    update: {
      title: sound.title,
      authorName: sound.author,
      duration: sound.duration,
      coverUrl: sound.cover_url,
      audioUrl: sound.link,
      videoCount,
      dailyVideoCount,
      previousRank: existing?.currentRank,
      currentRank: rank,
      rankChange,
      videoVelocity,
      velocityChange,
      isViral,
      isTrending,
      lastUpdatedAt: new Date(),
    },
  });

  // Create daily snapshot (only if we have a video count)
  if (videoCount > 0) {
    await prisma.soundSnapshot.create({
      data: {
        soundId: upsertedSound.id,
        videoCount,
        rank,
        videoVelocity,
      },
    });
  }

  return upsertedSound;
}

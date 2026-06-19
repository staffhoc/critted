import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTikHub, localeToRegion, TikHubSound } from "@/lib/tikhub";
import { Locale } from "@/generated/prisma";

// Vercel Cron: Run daily at 3 AM UTC
// Configure in vercel.json: "crons": [{ "path": "/api/cron/sync-sounds", "schedule": "0 3 * * *" }]

// Markets to sync
const MARKETS_TO_SYNC: Locale[] = ["US", "UK"];

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
    const tikHub = getTikHub();

    for (const locale of MARKETS_TO_SYNC) {
      const region = localeToRegion(locale);
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
        console.log(`[Sync Sounds] Fetching sounds for region: ${region}`);

        // Fetch trending sounds from TikHub
        // Note: TikHub uses Douyin music endpoint as a fallback
        const response = await tikHub.getTrendingSounds({
          region,
          limit: 100,
        });

        console.log(`[Sync Sounds] Got ${response.sounds?.length || 0} sounds for ${region}`);
        const sounds = response.sounds || [];

        for (let i = 0; i < sounds.length; i++) {
          const sound = sounds[i];
          const rank = i + 1;

          try {
            await upsertSound(sound, locale, rank);
            processed++;
          } catch (error) {
            console.error(`Failed to process sound ${sound.music_id}:`, error);
            failed++;
          }
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
        console.error(`Failed to sync sounds for ${locale}:`, error);

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
  sound: TikHubSound,
  locale: Locale,
  rank: number
) {
  const externalId = sound.music_id;

  // Find existing sound
  const existing = await prisma.sound.findUnique({
    where: { externalId },
  });

  // Calculate velocity (videos per day) based on previous data
  let videoVelocity = 0;
  let velocityChange = 0;

  if (existing) {
    // Get last snapshot to calculate velocity
    const lastSnapshot = await prisma.soundSnapshot.findFirst({
      where: { soundId: existing.id },
      orderBy: { snapshotDate: "desc" },
    });

    if (lastSnapshot) {
      const daysSinceSnapshot = Math.max(
        1,
        (Date.now() - lastSnapshot.snapshotDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const videoDiff = sound.video_count - lastSnapshot.videoCount;
      videoVelocity = videoDiff / daysSinceSnapshot;

      // Calculate velocity change percentage
      if (lastSnapshot.videoVelocity > 0) {
        velocityChange = ((videoVelocity - lastSnapshot.videoVelocity) / lastSnapshot.videoVelocity) * 100;
      }
    }
  }

  // Calculate rank change
  const previousRank = existing?.currentRank ?? null;
  const rankChange = previousRank ? previousRank - rank : 0;

  // Determine viral/trending status
  const isViral = sound.video_count >= VIRAL_THRESHOLD;
  const isTrending = velocityChange >= TRENDING_VELOCITY_THRESHOLD;

  // Calculate daily video count (videos created today)
  const dailyVideoCount = Math.max(0, Math.round(videoVelocity));

  // Upsert sound
  const upsertedSound = await prisma.sound.upsert({
    where: { externalId },
    create: {
      externalId,
      locale,
      title: sound.title,
      authorName: sound.author_name,
      duration: sound.duration,
      coverUrl: sound.cover_url,
      audioUrl: sound.play_url,
      videoCount: sound.video_count,
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
      authorName: sound.author_name,
      duration: sound.duration,
      coverUrl: sound.cover_url,
      audioUrl: sound.play_url,
      videoCount: sound.video_count,
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

  // Create daily snapshot
  await prisma.soundSnapshot.create({
    data: {
      soundId: upsertedSound.id,
      videoCount: sound.video_count,
      rank,
      videoVelocity,
    },
  });

  return upsertedSound;
}

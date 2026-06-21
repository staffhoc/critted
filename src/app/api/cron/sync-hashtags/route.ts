import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSociaVault, NormalizedHashtag } from "@/lib/sociavault";
import { Locale } from "@/generated/prisma";

// Vercel Cron: Run daily at 3:30 AM UTC
// Configure in vercel.json: "crons": [{ "path": "/api/cron/sync-hashtags", "schedule": "30 3 * * *" }]

const MARKETS_TO_SYNC: { locale: Locale; countryCode: string }[] = [
  { locale: "US", countryCode: "US" },
];

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
          type: "hashtags",
          locale,
          status: "running",
          startedAt: new Date(),
        },
      });

      try {
        console.log(`[Sync Hashtags] Fetching popular hashtags for country: ${countryCode}`);

        // Fetch popular hashtags (7 days)
        const response = await sociaVault.getPopularHashtags({
          page: 1,
          period: 7,
          countryCode,
        });

        console.log(`[Sync Hashtags] Got ${response.hashtags.length} hashtags for ${countryCode}`);

        for (const hashtag of response.hashtags) {
          try {
            await upsertHashtag(hashtag, locale);
            processed++;
          } catch (error) {
            console.error(`Failed to process hashtag ${hashtag.name}:`, error);
            failed++;
          }
        }

        // Also fetch newly trending hashtags
        try {
          const newResponse = await sociaVault.getPopularHashtags({
            page: 1,
            period: 7,
            countryCode,
            newOnBoard: true,
          });

          console.log(`[Sync Hashtags] Got ${newResponse.hashtags.length} new trending hashtags for ${countryCode}`);

          for (const hashtag of newResponse.hashtags) {
            // Check if already processed
            const exists = await prisma.hashtag.findUnique({
              where: { externalId: hashtag.hashtag_id },
            });

            if (!exists) {
              try {
                await upsertHashtag(hashtag, locale, true);
                processed++;
              } catch (error) {
                console.error(`Failed to process new hashtag ${hashtag.name}:`, error);
                failed++;
              }
            }
          }
        } catch (newError) {
          console.error(`Failed to fetch new hashtags for ${countryCode}:`, newError);
        }

        console.log(`[Sync Hashtags] Completed for ${countryCode}: ${processed} processed, ${failed} failed`);

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
        console.error(`Failed to sync hashtags for ${locale}:`, errorMessage);

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
    console.error("Hashtag sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync hashtags" },
      { status: 500 }
    );
  }
}

async function upsertHashtag(
  hashtag: NormalizedHashtag,
  locale: Locale,
  isNew: boolean = false
) {
  const externalId = hashtag.hashtag_id;
  const rank = hashtag.rank;

  // Find existing hashtag
  const existing = await prisma.hashtag.findUnique({
    where: { externalId },
  });

  // Calculate rank change
  const previousRank = existing?.currentRank ?? null;
  const rankChange = hashtag.rank_change ?? (previousRank ? previousRank - rank : 0);

  // Determine trending status (top 50 or rank improved)
  const isTrending = rank <= 50 || rankChange > 0;

  // Upsert hashtag
  const upsertedHashtag = await prisma.hashtag.upsert({
    where: { externalId },
    create: {
      externalId,
      locale,
      name: hashtag.name,
      videoCount: hashtag.video_count,
      viewCount: BigInt(hashtag.view_count),
      currentRank: rank,
      previousRank,
      rankChange,
      isTrending,
      isNew,
      trendData: hashtag.trend_data ? hashtag.trend_data : undefined,
      lastUpdatedAt: new Date(),
    },
    update: {
      name: hashtag.name,
      videoCount: hashtag.video_count,
      viewCount: BigInt(hashtag.view_count),
      previousRank: existing?.currentRank,
      currentRank: rank,
      rankChange,
      isTrending,
      trendData: hashtag.trend_data ? hashtag.trend_data : undefined,
      lastUpdatedAt: new Date(),
    },
  });

  // Create daily snapshot
  await prisma.hashtagSnapshot.create({
    data: {
      hashtagId: upsertedHashtag.id,
      videoCount: hashtag.video_count,
      viewCount: BigInt(hashtag.view_count),
      rank,
    },
  });

  return upsertedHashtag;
}

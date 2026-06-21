import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSociaVault, NormalizedVideo } from "@/lib/sociavault";
import { Locale } from "@/generated/prisma";

// Vercel Cron: Run daily at 4:30 AM UTC
// Configure in vercel.json: "crons": [{ "path": "/api/cron/sync-videos", "schedule": "30 4 * * *" }]

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
          type: "videos",
          locale,
          status: "running",
          startedAt: new Date(),
        },
      });

      try {
        console.log(`[Sync Videos] Fetching popular videos for country: ${countryCode}`);

        // Fetch popular videos by likes
        const likeResponse = await sociaVault.getPopularVideos({
          page: 1,
          period: 7,
          orderBy: "like",
          countryCode,
        });

        console.log(`[Sync Videos] Got ${likeResponse.videos.length} videos by likes for ${countryCode}`);

        for (const video of likeResponse.videos) {
          try {
            await upsertVideo(video, locale);
            processed++;
          } catch (error) {
            console.error(`Failed to process video ${video.video_id}:`, error);
            failed++;
          }
        }

        // Also fetch by views (hot)
        try {
          const hotResponse = await sociaVault.getPopularVideos({
            page: 1,
            period: 7,
            orderBy: "hot",
            countryCode,
          });

          console.log(`[Sync Videos] Got ${hotResponse.videos.length} videos by views for ${countryCode}`);

          for (const video of hotResponse.videos) {
            // Check if already processed
            const exists = await prisma.video.findUnique({
              where: { externalId: video.video_id },
            });

            if (!exists) {
              try {
                await upsertVideo(video, locale);
                processed++;
              } catch (error) {
                console.error(`Failed to process video ${video.video_id}:`, error);
                failed++;
              }
            }
          }
        } catch (hotError) {
          console.error(`Failed to fetch hot videos for ${countryCode}:`, hotError);
        }

        console.log(`[Sync Videos] Completed for ${countryCode}: ${processed} processed, ${failed} failed`);

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
        console.error(`Failed to sync videos for ${locale}:`, errorMessage);

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
    console.error("Video sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync videos" },
      { status: 500 }
    );
  }
}

async function upsertVideo(video: NormalizedVideo, locale: Locale) {
  const externalId = video.video_id;

  // Calculate engagement rate
  const totalEngagement = video.like_count + video.comment_count + video.share_count;
  const engagementRate = video.play_count > 0
    ? (totalEngagement / video.play_count) * 100
    : 0;

  // Upsert video
  const upsertedVideo = await prisma.video.upsert({
    where: { externalId },
    create: {
      externalId,
      locale,
      description: video.description,
      thumbnailUrl: video.thumbnail_url,
      videoUrl: video.link,
      duration: video.duration,
      viewCount: video.play_count,
      likeCount: video.like_count,
      commentCount: video.comment_count,
      shareCount: video.share_count,
      engagementRate,
    },
    update: {
      description: video.description,
      thumbnailUrl: video.thumbnail_url,
      videoUrl: video.link,
      duration: video.duration,
      viewCount: video.play_count,
      likeCount: video.like_count,
      commentCount: video.comment_count,
      shareCount: video.share_count,
      engagementRate,
    },
  });

  return upsertedVideo;
}

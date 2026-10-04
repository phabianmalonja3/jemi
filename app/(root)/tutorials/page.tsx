
// app/tutorials/page.tsx

import VideoCard from "@/components/web/VideoCard";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

async function getUploadsPlaylistId(
  apiKey: string,
  channelId: string
): Promise<string | null> {
  const url =
    `https://www.googleapis.com/youtube/v3/channels` +
    `?part=contentDetails` +
    `&id=${encodeURIComponent(channelId)}` +
    `&key=${encodeURIComponent(apiKey)}`;

  console.log("========================================");
  console.log("🎬 Getting YouTube Uploads Playlist");
  console.log("========================================");
  console.log("Channel ID:", channelId);

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    console.log("Channel API Status:", response.status);

    const data = await response.json();

    console.log("Channel API Response:", data);

    if (!response.ok) {
      console.error("❌ Failed to get YouTube channel.");
      console.error("Status:", response.status);
      console.error("Response:", data);
      return null;
    }

    if (
      !data.items ||
      !Array.isArray(data.items) ||
      data.items.length === 0
    ) {
      console.error("❌ YouTube channel was not found.");
      return null;
    }

    const uploadsPlaylistId =
      data.items[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      console.error("❌ Uploads playlist was not found.");
      return null;
    }

    console.log("✅ Uploads Playlist ID:", uploadsPlaylistId);

    return uploadsPlaylistId;
  } catch (error) {
    console.error("❌ Error getting uploads playlist:");
    console.error(error);

    return null;
  }
}

async function getYouTubeVideos(): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  console.log("========================================");
  console.log("🎥 YouTube Videos");
  console.log("========================================");

  console.log("YouTube API Key exists:", Boolean(apiKey));
  console.log("YouTube API Key length:", apiKey?.length ?? 0);
  console.log("YouTube Channel ID:", channelId);

  if (!apiKey) {
    console.error("❌ YOUTUBE_API_KEY is missing.");

    return [];
  }

  if (!channelId) {
    console.error("❌ YOUTUBE_CHANNEL_ID is missing.");

    return [];
  }

  const uploadsPlaylistId = await getUploadsPlaylistId(
    apiKey,
    channelId
  );

  if (!uploadsPlaylistId) {
    console.error("❌ Could not determine uploads playlist.");

    return [];
  }

  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=snippet` +
    `&playlistId=${encodeURIComponent(uploadsPlaylistId)}` +
    `&maxResults=9` +
    `&key=${encodeURIComponent(apiKey)}`;

  console.log("========================================");
  console.log("🎥 Fetching YouTube Videos");
  console.log("========================================");
  console.log("Uploads Playlist ID:", uploadsPlaylistId);
  console.log("YouTube API URL:");
  console.log(url.replace(apiKey, "********"));

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    console.log("YouTube API HTTP Status:", response.status);
    console.log("YouTube API OK:", response.ok);

    const data = await response.json();

    console.log("YouTube API Response:", data);

    if (!response.ok) {
      console.error("❌ YouTube API request failed.");
      console.error("Status:", response.status);
      console.error("Error response:", data);

      return [];
    }

    if (!data.items || !Array.isArray(data.items)) {
      console.error("❌ YouTube API did not return videos.");

      return [];
    }

    console.log(`✅ YouTube returned ${data.items.length} videos.`);

    const videos: YouTubeVideo[] = data.items
      .map((item: any) => {
        const videoId = item?.snippet?.resourceId?.videoId;

        const title = item?.snippet?.title;

        const description = item?.snippet?.description ?? "";

        const thumbnail =
          item?.snippet?.thumbnails?.high?.url ||
          item?.snippet?.thumbnails?.medium?.url ||
          item?.snippet?.thumbnails?.default?.url ||
          "";

        if (!videoId || !title) {
          console.warn("⚠️ Invalid YouTube item:", item);

          return null;
        }

        return {
          id: videoId,
          title,
          description,
          thumbnail,
        };
      })
      .filter(
        (video: YouTubeVideo | null): video is YouTubeVideo =>
          video !== null
      );

    console.log("✅ Processed YouTube videos:", videos);

    console.log("========================================");

    return videos;
  } catch (error) {
    console.error("❌ Error fetching YouTube videos:");
    console.error(error);

    return [];
  }
}

export default async function TutorialsPage() {
  const videos = await getYouTubeVideos();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Tutorials & Tips
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto">
          Explore our latest video tutorials, guides, and tech tips
          straight from our YouTube channel.
        </p>
      </div>

      {/* VIDEOS */}
      {videos.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>
            No tutorials available at the moment.
            Check back later!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              description={video.description}
              thumbnail={video.thumbnail}
            />
          ))}
        </div>
      )}
    </div>
  );
}


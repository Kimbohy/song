import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

interface SummaryStats {
  totalSongs: number;
  uniqueArtists: number;
  totalStreams: number;
  totalViews: number;
}

export async function GET() {
  try {
    const conn = await createConnection();

    // Get summary stats directly from SQL
    const [summaryStatsRows] = await conn.execute(`
      SELECT 
        COUNT(*) as totalSongs,
        COUNT(DISTINCT artist) as uniqueArtists,
        SUM(stream) as totalStreams,
        SUM(views) as totalViews
      FROM songs
    `);
    
    // Type assertion to handle mysql2 result format
    const summaryStats = summaryStatsRows as unknown as SummaryStats[];

    // Get top artists by total streams
    const [topArtists] = await conn.execute(`
      SELECT artist, 
             COUNT(*) as track_count,
             SUM(stream) as total_streams,
             AVG(danceability) as avg_danceability,
             AVG(energy) as avg_energy,
             AVG(valence) as avg_valence
      FROM songs 
      GROUP BY artist
      ORDER BY total_streams DESC 
      LIMIT 5
    `);

    // Get genre distribution (using album_type as proxy)
    const [genreStats] = await conn.execute(`
      SELECT album_type, COUNT(*) as count
      FROM songs
      GROUP BY album_type
      ORDER BY count DESC
    `);

    // Get platform comparison
    const [platformStats] = await conn.execute(`
      SELECT track, artist,
             stream as spotify_streams,
             views as youtube_views,
             likes as youtube_likes,
             comments as youtube_comments
      FROM songs
      WHERE stream > 0 AND views > 0
      ORDER BY stream + views DESC
      LIMIT 15
    `);

    await conn.end();

    return NextResponse.json({
      stats: summaryStats[0],
      topArtists,
      genreStats,
      platformStats,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("artist");
    const limit = parseInt(searchParams.get("limit") || "10");

    const conn = await createConnection();

    // Base statistics - using query instead of execute to avoid parameter issues
    const [topArtists] = await conn.query(
      `SELECT 
        artist,
        COUNT(*) as song_count,
        AVG(stream) as avg_streams,
        SUM(views) as total_views,
        AVG(danceability) as avg_danceability,
        AVG(energy) as avg_energy,
        AVG(valence) as avg_valence
      FROM songs
      ${artist ? "WHERE artist = ?" : ""}
      GROUP BY artist
      ORDER BY avg_streams DESC
      LIMIT ${limit}`,
      artist ? [artist] : []
    );

    // Audio features distribution
    const [audioFeatures] = await conn.query(
      `SELECT 
        AVG(danceability) as avg_danceability,
        AVG(energy) as avg_energy,
        AVG(valence) as avg_valence,
        AVG(acousticness) as avg_acousticness,
        AVG(instrumentalness) as avg_instrumentalness,
        AVG(liveness) as avg_liveness,
        AVG(speechiness) as avg_speechiness
      FROM songs
      ${artist ? "WHERE artist = ?" : ""}`,
      artist ? [artist] : []
    );

    // Genre analysis
    const [genreAnalysis] = await conn.query(
      `SELECT 
        CASE 
          WHEN danceability > 0.7 AND energy > 0.7 THEN 'Dance/Electronic'
          WHEN instrumentalness > 0.5 THEN 'Instrumental'
          WHEN acousticness > 0.7 THEN 'Acoustic'
          WHEN energy > 0.7 AND valence < 0.4 THEN 'Rock/Metal'
          WHEN speechiness > 0.5 THEN 'Hip Hop/Rap'
          ELSE 'Pop/Other'
        END as predicted_genre,
        COUNT(*) as track_count,
        AVG(stream) as avg_streams,
        AVG(views) as avg_views
      FROM songs
      ${artist ? "WHERE artist = ?" : ""}
      GROUP BY predicted_genre
      ORDER BY track_count DESC`,
      artist ? [artist] : []
    );

    // Platform comparison
    const [platformStats] = await conn.query(
      `SELECT 
        artist,
        track,
        album,
        stream as spotify_streams,
        views as youtube_views,
        likes as youtube_likes,
        comments as youtube_comments,
        licensed,
        official_video,
        url_spotify,
        url_youtube
      FROM songs
      ${artist ? "WHERE artist = ?" : ""}
      ORDER BY stream + views DESC
      LIMIT ${limit}`,
      artist ? [artist] : []
    );

    // Correlation analysis
    const [correlations] = await conn.query(
      `SELECT 
        track,
        danceability,
        energy,
        valence,
        stream,
        views
      FROM songs
      ${artist ? "WHERE artist = ?" : ""}
      ORDER BY stream DESC
      LIMIT ${limit}`,
      artist ? [artist] : []
    );

    await conn.end();

    return NextResponse.json({
      topArtists,
      audioFeatures: audioFeatures[0],
      platformStats,
      genreAnalysis,
      correlations,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { name: string } }
) {
  try {
    const { name } = await Promise.resolve(context.params);
    const artistName = decodeURIComponent(name);
    const conn = await createConnection();

    // Get artist stats
    const [artistStats] = await conn.query(
      `SELECT 
        artist,
        COUNT(*) as song_count,
        SUM(stream) as total_streams,
        SUM(views) as total_views,
        AVG(danceability) as avg_danceability,
        AVG(energy) as avg_energy,
        AVG(valence) as avg_valence,
        AVG(acousticness) as avg_acousticness,
        AVG(instrumentalness) as avg_instrumentalness
      FROM songs
      WHERE artist = ?
      GROUP BY artist`,
      [artistName]
    );

    // Get artist's songs
    const [songs] = await conn.query(
      `SELECT 
        track, album, album_type, stream, views, likes, comments,
        danceability, energy, valence, acousticness, instrumentalness,
        url_spotify, url_youtube
      FROM songs
      WHERE artist = ?
      ORDER BY stream DESC`,
      [artistName]
    );

    // Get time distribution (using album_type as proxy for release timeline)
    const [albumTypes] = await conn.query(
      `SELECT 
        album_type,
        COUNT(*) as count,
        SUM(stream) as total_streams,
        SUM(views) as total_views
      FROM songs
      WHERE artist = ?
      GROUP BY album_type`,
      [artistName]
    );

    await conn.end();

    if (!artistStats || !(artistStats as any[])[0]) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    return NextResponse.json({
      artist: (artistStats as any[])[0],
      songs: songs,
      albumTypes: albumTypes,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch artist data" },
      { status: 500 }
    );
  }
}

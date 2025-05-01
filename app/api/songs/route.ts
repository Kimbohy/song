import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const urlParams = request.nextUrl.searchParams;
    const search = urlParams.get("search") || "";
    const sort = urlParams.get("sort") || "stream";
    const order =
      urlParams.get("order")?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const page = parseInt(urlParams.get("page") || "1");
    const limit = parseInt(urlParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const conn = await createConnection();

    // Validate sort column to prevent SQL injection
    const allowedSortColumns = [
      "stream",
      "views",
      "track",
      "artist",
      "album",
      "likes",
      "comments",
    ];
    const safeSort = allowedSortColumns.includes(sort) ? sort : "stream";

    // Build the WHERE clause and parameters
    const whereClause = search
      ? "WHERE artist LIKE :search OR track LIKE :search OR album LIKE :search"
      : "";
    const params = {
      limit,
      offset,
      ...(search && { search: `%${search}%` }),
    };

    // Get total count for pagination
    const [countResult] = await conn.query(
      `SELECT COUNT(*) as count FROM songs ${whereClause}`,
      params
    );
    const totalCount = (countResult as any)[0].count;

    // Get songs with pagination and sorting, including additional fields for the modal
    const [songs] = await conn.query(
      `SELECT 
        track, artist, album, album_type, stream, views, 
        likes, comments, url_spotify, url_youtube, 
        danceability, energy, valence
       FROM songs 
       ${whereClause}
       ORDER BY ${safeSort} ${order}
       LIMIT :limit OFFSET :offset`,
      params
    );

    await conn.end();

    return NextResponse.json({
      songs,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

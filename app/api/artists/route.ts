import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const urlParams = request.nextUrl.searchParams;
    const search = urlParams.get("search") || "";
    const sort = urlParams.get("sort") || "total_streams";
    const order =
      urlParams.get("order")?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const page = parseInt(urlParams.get("page") || "1");
    const limit = parseInt(urlParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const conn = await createConnection();

    // Validate sort column to prevent SQL injection
    const allowedSortColumns = [
      "total_streams",
      "total_views",
      "artist",
      "track_count",
      "avg_danceability",
      "avg_energy",
    ];
    const safeSort = allowedSortColumns.includes(sort) ? sort : "total_streams";

    // Build the WHERE clause and parameters
    const whereClause = search ? "HAVING artist LIKE :search" : "";
    const params = {
      limit,
      offset,
      ...(search && { search: `%${search}%` }),
    };

    // Get total count for pagination
    const [countResult] = await conn.query(
      `SELECT COUNT(*) as count FROM (
        SELECT artist
        FROM songs
        GROUP BY artist
        ${whereClause}
      ) as artist_count`,
      params
    );
    const totalCount = (countResult as any)[0].count;

    // Get artists with their aggregated stats
    const [artists] = await conn.query(
      `SELECT 
        artist,
        COUNT(*) as track_count,
        SUM(stream) as total_streams,
        SUM(views) as total_views,
        AVG(danceability) as avg_danceability,
        AVG(energy) as avg_energy,
        AVG(valence) as avg_valence
      FROM songs
      GROUP BY artist
      ${whereClause}
      ORDER BY ${safeSort} ${order}
      LIMIT :limit OFFSET :offset`,
      params
    );

    await conn.end();

    return NextResponse.json({
      artists,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}

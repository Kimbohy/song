import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const urlParams = request.nextUrl.searchParams;

    // Basic filtering
    const search = urlParams.get("search") || "";
    const sort = urlParams.get("sort") || "stream";
    const order =
      urlParams.get("order")?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const page = parseInt(urlParams.get("page") || "1");
    const limit = parseInt(urlParams.get("limit") || "10");
    const offset = (page - 1) * limit;
    const timePeriod = urlParams.get("time") || "all";

    // Advanced filtering parameters
    const minDanceability = parseFloat(urlParams.get("minDanceability") || "0");
    const maxDanceability = parseFloat(urlParams.get("maxDanceability") || "1");
    const minEnergy = parseFloat(urlParams.get("minEnergy") || "0");
    const maxEnergy = parseFloat(urlParams.get("maxEnergy") || "1");
    const minValence = parseFloat(urlParams.get("minValence") || "0");
    const maxValence = parseFloat(urlParams.get("maxValence") || "1");
    const minStreams = parseFloat(urlParams.get("minStreams") || "0");
    const maxStreams = parseFloat(
      urlParams.get("maxStreams") || "999999999999"
    );
    const minViews = parseFloat(urlParams.get("minViews") || "0");
    const maxViews = parseFloat(urlParams.get("maxViews") || "999999999999");
    const albumType = urlParams.get("albumType") || "";

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
      "danceability",
      "energy",
      "valence",
    ];
    const safeSort = allowedSortColumns.includes(sort) ? sort : "stream";

    // Build WHERE clause with all filter conditions
    let whereConditions = [];
    let params: Record<string, any> = {
      limit,
      offset,
      minDanceability,
      maxDanceability,
      minEnergy,
      maxEnergy,
      minValence,
      maxValence,
      minStreams,
      maxStreams,
      minViews,
      maxViews,
    };

    // Text search
    if (search) {
      whereConditions.push(
        "(artist LIKE :search OR track LIKE :search OR album LIKE :search)"
      );
      params.search = `%${search}%`;
    }

    // Album type filter
    if (albumType) {
      whereConditions.push("album_type = :albumType");
      params.albumType = albumType;
    }

    // Audio features filters
    whereConditions.push(
      "danceability BETWEEN :minDanceability AND :maxDanceability",
      "energy BETWEEN :minEnergy AND :maxEnergy",
      "valence BETWEEN :minValence AND :maxValence",
      "stream BETWEEN :minStreams AND :maxStreams",
      "views BETWEEN :minViews AND :maxViews"
    );

    // Time period filter
    if (timePeriod !== "all") {
      const currentDate = new Date();
      let timeFilter;

      switch (timePeriod) {
        case "year":
          timeFilter = new Date(
            currentDate.setFullYear(currentDate.getFullYear() - 1)
          );
          break;
        case "month":
          timeFilter = new Date(
            currentDate.setMonth(currentDate.getMonth() - 1)
          );
          break;
        case "week":
          timeFilter = new Date(currentDate.setDate(currentDate.getDate() - 7));
          break;
        default:
          timeFilter = null;
      }

      if (timeFilter) {
        // Note: This assumes we have a release_date column
        // If that column doesn't exist, you'd need to add it to the database
        whereConditions.push("release_date >= :timeFilter");
        params.timeFilter = timeFilter.toISOString().split("T")[0];
      }
    }

    // Build the final WHERE clause
    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get total count for pagination
    const [countResult] = await conn.query(
      `SELECT COUNT(*) as count FROM songs ${whereClause}`,
      params
    );
    const totalCount = (countResult as any)[0].count;

    // Get songs with pagination and sorting
    const [songs] = await conn.query(
      `SELECT 
        track, artist, album, album_type, stream, views, 
        likes, comments, url_spotify, url_youtube, 
        danceability, energy, valence, acousticness, instrumentalness,
        song_key, tempo, duration_ms
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
      { error: "Failed to fetch songs with advanced filtering" },
      { status: 500 }
    );
  }
}

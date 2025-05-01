import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "stream";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    const conn = await createConnection();

    // Build the WHERE clause for search
    const whereClause = search
      ? "WHERE artist LIKE ? OR track LIKE ? OR album LIKE ?"
      : "";
    const searchPattern = `%${search}%`;
    const params = search ? [searchPattern, searchPattern, searchPattern] : [];

    // Get total count for pagination
    const [countResult] = await conn.execute(
      `SELECT COUNT(*) as count FROM songs ${whereClause}`,
      params
    );
    const totalCount = (countResult as any)[0].count;

    // Get songs with pagination and sorting
    const [songs] = await conn.execute(
      `SELECT * FROM songs 
       ${whereClause}
       ORDER BY ${sort} ${order}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get unique artists and album types for filters
    const [artists] = await conn.execute(
      "SELECT DISTINCT artist FROM songs ORDER BY artist"
    );
    const [albumTypes] = await conn.execute(
      "SELECT DISTINCT album_type FROM songs ORDER BY album_type"
    );

    await conn.end();

    return NextResponse.json({
      songs,
      totalCount,
      filters: {
        artists: (artists as any[]).map((a) => a.artist),
        albumTypes: (albumTypes as any[]).map((t) => t.album_type),
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

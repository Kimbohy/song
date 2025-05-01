"use client";

import { useEffect, useState } from "react";
import { Music2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface Artist {
  artist: string;
  track_count: number;
  total_streams: number;
  avg_danceability: number;
  avg_energy: number;
  avg_valence: number;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    async function fetchArtists() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/artists?page=${page}&limit=${itemsPerPage}&search=${search}`
        );
        const data = await res.json();
        setArtists(data.artists);
        setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArtists();
  }, [page, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Artists</h1>
          <p className="text-gray-600">Browse all artists and their stats</p>
        </div>
        <input
          type="search"
          placeholder="Search artists..."
          className="w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-b-2 border-indigo-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist, idx) => (
              <Link
                key={artist.artist}
                href={`/artists/${encodeURIComponent(artist.artist)}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 transition-all duration-200 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-indigo-50">
                      <Music2 className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {artist.artist}
                      </h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Songs</span>
                          <span className="font-medium">
                            {artist.track_count}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Streams</span>
                          <div className="flex items-center gap-1 text-green-600">
                            <PlayCircle className="w-4 h-4" />
                            <span>{formatNumber(artist.total_streams)}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Danceability</span>
                            <span>
                              {Math.round(artist.avg_danceability * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${Math.round(
                                  artist.avg_danceability * 100
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Energy</span>
                            <span>{Math.round(artist.avg_energy * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${Math.round(
                                  artist.avg_energy * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = page;
                if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - (4 - i);
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      pageNum === page
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

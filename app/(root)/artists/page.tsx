"use client";

import { useEffect, useState } from "react";
import { Music2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

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
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchArtists() {
      try {
        setLoading(true);
        const res = await fetch("/api/stats");
        const data = await res.json();
        setArtists(data.topArtists);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArtists();
  }, []);

  const filteredArtists = search
    ? artists.filter((artist) =>
        artist.artist.toLowerCase().includes(search.toLowerCase())
      )
    : artists;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArtists.length / itemsPerPage)
  );
  const paginatedArtists = filteredArtists.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Artists</h1>
          <p className="text-gray-600">Browse all artists and their stats</p>
        </div>
        <input
          type="search"
          placeholder="Search artists..."
          className="px-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArtists.map((artist, idx) => (
              <motion.div
                key={artist.artist}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <Music2 className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{artist.artist}</h3>
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
                          <PlayCircle className="h-4 w-4" />
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
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${Math.round(artist.avg_energy * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${
                  p === page
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

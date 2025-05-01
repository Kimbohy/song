"use client";

import { useEffect, useState } from "react";
import { PlayCircle, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";
import SongModal from "@/components/SongModal";

interface Song {
  track: string;
  artist: string;
  album: string;
  album_type: string;
  stream: number;
  views: number;
  likes: number;
  comments: number;
  danceability: number;
  energy: number;
  valence: number;
  url_spotify?: string;
  url_youtube?: string;
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/songs?page=${page}&limit=${itemsPerPage}&search=${search}`
        );
        const data = await res.json();
        setSongs(data.songs);
        setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, [page, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Songs</h1>
          <p className="text-gray-600">Browse and explore all songs</p>
        </div>
        <input
          type="search"
          placeholder="Search songs..."
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
          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Song
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Album
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Streams
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Views
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {songs.map((song, idx) => (
                    <motion.tr
                      key={`${song.track}-${song.artist}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedSong(song)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium">{song.track}</div>
                          <div className="text-sm text-gray-500">
                            {song.artist}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm">{song.album}</div>
                          <div className="text-xs text-gray-500">
                            {song.album_type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-green-600">
                          <PlayCircle className="w-4 h-4" />
                          <span>{formatNumber(song.stream)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-red-600">
                          <Youtube className="w-4 h-4" />
                          <span>{formatNumber(song.views)}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 px-4 py-2 mt-4 overflow-x-auto">
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

      <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />
    </div>
  );
}

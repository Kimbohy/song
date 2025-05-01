import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Music,
  Activity,
  Zap,
  Smile,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface FilterResultsProps {
  isLoading: boolean;
  songs: any[];
  totalSongs: number;
  currentPage: number;
  totalPages: number;
  onSongSelect: (song: any) => void;
  onPageChange: (page: number) => void;
}

export default function FilterResults({
  isLoading,
  songs,
  totalSongs,
  currentPage,
  totalPages,
  onSongSelect,
  onPageChange,
}: FilterResultsProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center p-10 bg-white shadow-md rounded-xl">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute w-16 h-16 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-500">
            Finding your perfect tracks...
          </p>
        </div>
      </div>
    );
  }

  // No results state
  if (songs.length === 0) {
    return (
      <div className="p-12 text-center bg-white shadow-md rounded-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 rounded-full">
          <Search className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          No matching tracks found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  // Feature color mapping
  const getFeatureColorClass = (value: number) => {
    if (value < 0.33) return "bg-amber-500";
    if (value < 0.67) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden bg-white shadow-md rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Track
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Artist
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Album
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  <div className="flex items-center">
                    <Music className="w-3 h-3 mr-1" />
                    Streams
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
                >
                  <div className="flex items-center justify-center">
                    <Activity className="w-3 h-3 mr-1" />
                    Dance
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
                >
                  <div className="flex items-center justify-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Energy
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
                >
                  <div className="flex items-center justify-center">
                    <Smile className="w-3 h-3 mr-1" />
                    Mood
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {songs.map((song: any) => (
                <tr
                  key={`${song.artist}-${song.track}`}
                  className="transition-colors cursor-pointer hover:bg-blue-50"
                  onClick={() => onSongSelect(song)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {song.track}
                    </div>
                    {song.album_type && (
                      <span className="inline-flex items-center px-2 py-0.5 mt-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {song.album_type}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {song.artist}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {song.album}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatNumber(song.stream)}
                    </div>
                    {song.views > 0 && (
                      <div className="text-xs text-gray-500">
                        {formatNumber(song.views)} views
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="mb-1 text-xs font-medium">
                        {(song.danceability * 10).toFixed(1)}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getFeatureColorClass(
                            song.danceability
                          )}`}
                          style={{ width: `${song.danceability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="mb-1 text-xs font-medium">
                        {(song.energy * 10).toFixed(1)}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getFeatureColorClass(
                            song.energy
                          )}`}
                          style={{ width: `${song.energy * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="mb-1 text-xs font-medium">
                        {(song.valence * 10).toFixed(1)}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getFeatureColorClass(
                            song.valence
                          )}`}
                          style={{ width: `${song.valence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-9 h-9 rounded-md border transition-colors
                ${
                  currentPage === 1
                    ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show at most 5 page numbers around the current page
                let pageNum = currentPage;
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                // Skip if out of range
                if (pageNum <= 0 || pageNum > totalPages) {
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`flex items-center justify-center w-9 h-9 text-sm font-medium rounded-md transition-colors
                      ${
                        pageNum === currentPage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-9 h-9 rounded-md border transition-colors
                ${
                  currentPage === totalPages
                    ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-sm text-gray-500">{totalSongs} total songs</div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import RangeSlider from "@/components/RangeSlider";
import { formatNumber } from "@/lib/utils";
import { Sliders, Search, RefreshCcw } from "lucide-react";
import TimeFilter from "@/components/dashboard/TimeFilter";
import FilteredSongModal from "@/components/FilteredSongModal";

export default function AdvancedFilterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [totalSongs, setTotalSongs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSong, setSelectedSong] = useState(null);
  const [albumTypes, setAlbumTypes] = useState<string[]>([]);

  // Filter states
  const [search, setSearch] = useState("");
  const [minDanceability, setMinDanceability] = useState(0);
  const [maxDanceability, setMaxDanceability] = useState(1);
  const [minEnergy, setMinEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(1);
  const [minValence, setMinValence] = useState(0);
  const [maxValence, setMaxValence] = useState(1);
  const [minStreams, setMinStreams] = useState(0);
  const [maxStreams, setMaxStreams] = useState(500000000); // Reduced from 999999999999
  const [minViews, setMinViews] = useState(0);
  const [maxViews, setMaxViews] = useState(500000000); // Reduced from 999999999999
  const [selectedAlbumType, setSelectedAlbumType] = useState("");
  const [sort, setSort] = useState("stream");
  const [order, setOrder] = useState("DESC");
  const [timePeriod, setTimePeriod] = useState("all");

  // Load album types on mount
  useEffect(() => {
    const fetchAlbumTypes = async () => {
      try {
        const res = await fetch("/api/songs");
        const data = await res.json();

        // Extract unique album types
        if (data.songs && data.songs.length > 0) {
          const types = Array.from(
            new Set(data.songs.map((song: any) => song.album_type))
          ).filter(Boolean) as string[];
          setAlbumTypes(types);
        }
      } catch (error) {
        console.error("Error fetching album types:", error);
      }
    };

    fetchAlbumTypes();
  }, []);

  // Fetch songs with current filters
  const fetchFilteredSongs = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
        sort,
        order,
        time: timePeriod,
        minDanceability: minDanceability.toString(),
        maxDanceability: maxDanceability.toString(),
        minEnergy: minEnergy.toString(),
        maxEnergy: maxEnergy.toString(),
        minValence: minValence.toString(),
        maxValence: maxValence.toString(),
        minStreams: minStreams.toString(),
        maxStreams: maxStreams.toString(),
        minViews: minViews.toString(),
        maxViews: maxViews.toString(),
      });

      if (selectedAlbumType) {
        params.append("albumType", selectedAlbumType);
      }

      const res = await fetch(`/api/songs/filter?${params.toString()}`);
      const data = await res.json();

      setSongs(data.songs || []);
      setTotalSongs(data.totalCount || 0);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching filtered songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchFilteredSongs(1);
  };

  const handleTimeFilterChange = (period: string) => {
    setTimePeriod(period);
  };

  const handleDanceabilityChange = (low: number, high: number) => {
    setMinDanceability(low);
    setMaxDanceability(high);
  };

  const handleEnergyChange = (low: number, high: number) => {
    setMinEnergy(low);
    setMaxEnergy(high);
  };

  const handleValenceChange = (low: number, high: number) => {
    setMinValence(low);
    setMaxValence(high);
  };

  const handleStreamsChange = (low: number, high: number) => {
    setMinStreams(low);
    setMaxStreams(high);
  };

  const handleViewsChange = (low: number, high: number) => {
    setMinViews(low);
    setMaxViews(high);
  };

  const resetFilters = () => {
    setSearch("");
    setMinDanceability(0);
    setMaxDanceability(1);
    setMinEnergy(0);
    setMaxEnergy(1);
    setMinValence(0);
    setMaxValence(1);
    setMinStreams(0);
    setMaxStreams(500000000); // Update the reset value too
    setMinViews(0);
    setMaxViews(500000000); // Update the reset value too
    setSelectedAlbumType("");
    setSort("stream");
    setOrder("DESC");
    setTimePeriod("all");
    fetchFilteredSongs(1);
  };

  // Format values for display
  const formatDecimal = (value: number) => value.toFixed(2);
  const formatStreamValue = (value: number) => {
    if (value === 500000000) return "Max";
    return formatNumber(value);
  };

  useEffect(() => {
    fetchFilteredSongs();
  }, [timePeriod]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Advanced Music Filter</h1>
        <p className="mb-4 text-gray-600">
          Fine-tune your music discovery with precise audio feature filtering
        </p>
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center text-xl font-semibold">
              <Sliders className="w-5 h-5 mr-2 text-blue-600" />
              Filter Controls
            </h2>
            <button
              onClick={resetFilters}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <RefreshCcw className="w-4 h-4 mr-1" />
              Reset All
            </button>
          </div>

          {/* Search and Time filter row */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search artist, track or album..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Time Period
              </label>
              <TimeFilter
                onFilterChange={handleTimeFilterChange}
                defaultFilter={timePeriod}
              />
            </div>
          </div>

          {/* Album Type and Sort By row */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Album Type
              </label>
              <select
                value={selectedAlbumType}
                onChange={(e) => setSelectedAlbumType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {albumTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Sort By
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="stream">Streams</option>
                  <option value="views">Views</option>
                  <option value="track">Track Name</option>
                  <option value="artist">Artist</option>
                  <option value="danceability">Danceability</option>
                  <option value="energy">Energy</option>
                  <option value="valence">Valence</option>
                </select>
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DESC">Highest First</option>
                  <option value="ASC">Lowest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audio Features sliders */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium text-gray-800 text-md">
              Audio Features
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <RangeSlider
                min={0}
                max={1}
                step={0.01}
                defaultLow={minDanceability}
                defaultHigh={maxDanceability}
                label="Danceability"
                formatValue={formatDecimal}
                onChange={handleDanceabilityChange}
              />
              <RangeSlider
                min={0}
                max={1}
                step={0.01}
                defaultLow={minEnergy}
                defaultHigh={maxEnergy}
                label="Energy"
                formatValue={formatDecimal}
                onChange={handleEnergyChange}
              />
              <RangeSlider
                min={0}
                max={1}
                step={0.01}
                defaultLow={minValence}
                defaultHigh={maxValence}
                label="Valence (Mood)"
                formatValue={formatDecimal}
                onChange={handleValenceChange}
              />
            </div>
          </div>

          {/* Metrics sliders */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium text-gray-800 text-md">
              Popularity Metrics
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RangeSlider
                min={0}
                max={500000000} // Lowered from 1000000000
                step={1000000}
                defaultLow={minStreams}
                defaultHigh={maxStreams}
                label="Streams"
                formatValue={formatStreamValue}
                onChange={handleStreamsChange}
              />
              <RangeSlider
                min={0}
                max={500000000} // Lowered from 1000000000
                step={1000000}
                defaultLow={minViews}
                defaultHigh={maxViews}
                label="YouTube Views"
                formatValue={formatStreamValue}
                onChange={handleViewsChange}
              />
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center">
            <button
              onClick={handleFilterChange}
              disabled={isLoading}
              className="flex items-center px-8 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg shadow hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Apply Filters"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Results
            {totalSongs > 0 && (
              <span className="ml-2 text-base font-normal text-gray-500">
                ({totalSongs} songs found)
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8 bg-white shadow-lg rounded-xl">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading results...</p>
            </div>
          </div>
        ) : songs.length > 0 ? (
          <>
            <div className="overflow-hidden bg-white shadow-lg rounded-xl">
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
                        Streams
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Views
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Dance
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Energy
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Mood
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {songs.map((song: any) => (
                      <tr
                        key={`${song.artist}-${song.track}`}
                        className="transition-colors cursor-pointer hover:bg-blue-50"
                        onClick={() => setSelectedSong(song)}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {song.track}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {song.artist}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {song.album}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatNumber(song.stream)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatNumber(song.views)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${song.danceability * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{ width: `${song.energy * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-yellow-400 h-2.5 rounded-full"
                              style={{ width: `${song.valence * 100}%` }}
                            ></div>
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
              <div className="flex justify-center mt-6">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => {
                      if (currentPage > 1) {
                        fetchFilteredSongs(currentPage - 1);
                      }
                    }}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
                      ${
                        currentPage === 1
                          ? "text-gray-300"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border-t border-b border-gray-300">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      if (currentPage < totalPages) {
                        fetchFilteredSongs(currentPage + 1);
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium 
                      ${
                        currentPage === totalPages
                          ? "text-gray-300"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center bg-white shadow-lg rounded-xl">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-blue-500 bg-blue-100 rounded-full">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No songs found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your filters to see more results
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal - replacing DataModal with FilteredSongModal */}
      {selectedSong && (
        <FilteredSongModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
        />
      )}
    </div>
  );
}

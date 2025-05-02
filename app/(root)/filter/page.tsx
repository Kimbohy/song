"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/lib/utils";
import FilteredSongModal from "@/components/FilteredSongModal";
import FilterPanel from "@/components/filter/FilterPanel";
import FilterResults from "@/components/filter/FilterResults";
import FilterTags from "@/components/filter/FilterTags";

export default function AdvancedFilterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [totalSongs, setTotalSongs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSong, setSelectedSong] = useState(null);
  const [albumTypes, setAlbumTypes] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Active filters for tag display
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [activeFilterParams, setActiveFilterParams] = useState({});

  // Fetch album types on mount
  useEffect(() => {
    fetchAlbumTypes();
    // Initial load of songs
    fetchFilteredSongs();
  }, []);

  // Function to scroll to results section
  const scrollToResults = () => {
    if (resultsRef.current) {
      // Wait until loading is finished before scrolling
      if (!isLoading) {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  // Effect to scroll to results when loading finishes
  useEffect(() => {
    if (!isLoading && songs.length > 0 && activeFilters.length > 0) {
      scrollToResults();
    }
  }, [isLoading]);

  const fetchAlbumTypes = async () => {
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();

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

  const fetchFilteredSongs = async (page = 1, filters = {}) => {
    setIsLoading(true);
    try {
      // Build parameters from filters object
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...filters,
      });

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

  const handleApplyFilters = (filterValues: any) => {
    // Process the filters to transform them into API parameters
    const apiParams: Record<string, string> = {
      search: filterValues.search,
      minDanceability: filterValues.minDanceability.toString(),
      maxDanceability: filterValues.maxDanceability.toString(),
      minEnergy: filterValues.minEnergy.toString(),
      maxEnergy: filterValues.maxEnergy.toString(),
      minValence: filterValues.minValence.toString(),
      maxValence: filterValues.maxValence.toString(),
      minStreams: filterValues.minStreams.toString(),
      maxStreams: filterValues.maxStreams.toString(),
      sort: filterValues.sort,
      order: filterValues.order,
    };

    // Include album types if selected
    if (filterValues.albumTypes && filterValues.albumTypes.length > 0) {
      apiParams.albumType = filterValues.albumTypes.join(",");
    }

    // Save current filter state for tag display
    setActiveFilterParams(apiParams);

    // Update active filter tags
    updateActiveFilters(filterValues);

    // Fetch songs with new filters
    setCurrentPage(1);
    fetchFilteredSongs(1, apiParams);

    // We no longer need to call scrollToResults here as it will be triggered by the useEffect
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchFilteredSongs(page, activeFilterParams);
  };

  const updateActiveFilters = (filterValues: any) => {
    const newFilters = [];

    // Add search filter tag
    if (filterValues.search) {
      newFilters.push({
        id: "search",
        label: "Search",
        value: filterValues.search,
        onRemove: () => handleRemoveFilter("search"),
      });
    }

    // Add album type tags
    if (filterValues.albumTypes && filterValues.albumTypes.length > 0) {
      newFilters.push({
        id: "albumType",
        label: "Album Type",
        value: filterValues.albumTypes.join(", "),
        onRemove: () => handleRemoveFilter("albumType"),
      });
    }

    // Add audio feature tags - only if not "any"
    const featurePairs = [
      {
        min: "minDanceability",
        max: "maxDanceability",
        label: "Danceability",
        isDefault: (min: number, max: number) => min === 0 && max === 1,
      },
      {
        min: "minEnergy",
        max: "maxEnergy",
        label: "Energy",
        isDefault: (min: number, max: number) => min === 0 && max === 1,
      },
      {
        min: "minValence",
        max: "maxValence",
        label: "Mood",
        isDefault: (min: number, max: number) => min === 0 && max === 1,
      },
      {
        min: "minStreams",
        max: "maxStreams",
        label: "Popularity",
        isDefault: (min: number, max: number) => min === 0 && max === 500000000,
      },
    ];

    featurePairs.forEach((feature) => {
      const min = filterValues[feature.min];
      const max = filterValues[feature.max];

      if (!feature.isDefault(min, max)) {
        const minValue =
          feature.label === "Popularity" ? formatNumber(min) : min.toFixed(2);
        const maxValue =
          feature.label === "Popularity" ? formatNumber(max) : max.toFixed(2);

        newFilters.push({
          id: feature.min,
          label: feature.label,
          value: `${minValue} - ${maxValue}`,
          onRemove: () => handleRemoveFilter(feature.min),
        });
      }
    });

    setActiveFilters(newFilters);
  };

  const handleRemoveFilter = (filterId: string) => {
    // This would typically reset the specific filter and reapply
    // For demo purposes, we're just showing the UI interaction
    setActiveFilters(activeFilters.filter((f) => f.id !== filterId));
  };

  const handleResetFilters = () => {
    setActiveFilters([]);
    setActiveFilterParams({});
    fetchFilteredSongs();
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8 ">
        <div className="p-6 mb-4 bg-white rounded-lg shadow-sm">
          <h1 className="mb-2 text-3xl font-bold">Interactive Song Explorer</h1>
          <p className="text-gray-600 ">
            Discover music by audio features, popularity, and more
          </p>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          onApplyFilters={handleApplyFilters}
          albumTypes={albumTypes}
          isLoading={isLoading}
        />
      </div>

      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <FilterTags filters={activeFilters} onReset={handleResetFilters} />
        </div>
      )}

      {/* Results section */}
      <div ref={resultsRef}>
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

        {/* Results table */}
        <FilterResults
          isLoading={isLoading}
          songs={songs}
          totalSongs={totalSongs}
          currentPage={currentPage}
          totalPages={totalPages}
          onSongSelect={setSelectedSong}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Song detail modal */}
      {selectedSong && (
        <FilteredSongModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
        />
      )}
    </div>
  );
}

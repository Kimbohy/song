import React, { useState } from "react";
import {
  Sliders,
  Search,
  RefreshCcw,
  Music,
  BarChart2,
  Album,
  ArrowDownUp,
  Activity,
  Zap,
  Smile,
} from "lucide-react";
import ButtonRangeSelector from "./ButtonRangeSelector";
import ButtonMultiSelect from "./ButtonMultiSelect";
import SearchFilterBar from "./SearchFilterBar";

interface FilterPanelProps {
  onApplyFilters: (filters: any) => void;
  albumTypes: string[];
  isLoading: boolean;
}

export default function FilterPanel({
  onApplyFilters,
  albumTypes,
  isLoading,
}: FilterPanelProps) {
  // Search and text filter states
  const [search, setSearch] = useState("");
  const [selectedAlbumTypes, setSelectedAlbumTypes] = useState<string[]>([]);

  // Audio feature range selections - use predefined sets
  const [danceabilityLevel, setDanceabilityLevel] = useState("any");
  const [energyLevel, setEnergyLevel] = useState("any");
  const [valenceLevel, setValenceLevel] = useState("any");
  const [popularityLevel, setPopularityLevel] = useState("any");

  // Sort options
  const [sort, setSort] = useState("stream");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  // Include all potential album types including compilation
  const allAlbumTypes = [...new Set([...albumTypes, "compilation"])].filter(
    Boolean
  );

  const danceabilityOptions = [
    { value: "any", label: "Any", min: 0, max: 1 },
    { value: "low", label: "Low", min: 0, max: 0.33 },
    { value: "medium", label: "Medium", min: 0.33, max: 0.67 },
    { value: "high", label: "High", min: 0.67, max: 1 },
  ];

  const energyOptions = [
    { value: "any", label: "Any", min: 0, max: 1 },
    { value: "low", label: "Low", min: 0, max: 0.33 },
    { value: "medium", label: "Medium", min: 0.33, max: 0.67 },
    { value: "high", label: "High", min: 0.67, max: 1 },
  ];

  const valenceOptions = [
    { value: "any", label: "Any", min: 0, max: 1 },
    { value: "sad", label: "Sad", min: 0, max: 0.33 },
    { value: "neutral", label: "Neutral", min: 0.33, max: 0.67 },
    { value: "happy", label: "Happy", min: 0.67, max: 1 },
  ];

  const popularityOptions = [
    { value: "any", label: "Any", min: 0, max: 500000000 },
    { value: "niche", label: "Niche", min: 0, max: 1000000 },
    { value: "popular", label: "Popular", min: 1000000, max: 50000000 },
    { value: "hit", label: "Hit", min: 50000000, max: 500000000 },
  ];

  const sortOptions = [
    { value: "stream", label: "Streams" },
    { value: "views", label: "Views" },
    { value: "track", label: "Track Name" },
    { value: "artist", label: "Artist" },
    { value: "danceability", label: "Danceability" },
    { value: "energy", label: "Energy" },
    { value: "valence", label: "Mood" },
  ];

  const handleRangeChange = (
    id: string,
    value: string,
    min: number,
    max: number
  ) => {
    switch (id) {
      case "danceability":
        setDanceabilityLevel(value);
        break;
      case "energy":
        setEnergyLevel(value);
        break;
      case "valence":
        setValenceLevel(value);
        break;
      case "popularity":
        setPopularityLevel(value);
        break;
    }
  };

  const handleMultiSelectChange = (id: string, values: string[]) => {
    switch (id) {
      case "albumType":
        setSelectedAlbumTypes(values);
        break;
    }
  };

  const handleSortChange = (id: string, values: string[]) => {
    if (values.length > 0) {
      setSort(values[0]);
    }
  };

  const handleOrderToggle = () => {
    setOrder(order === "DESC" ? "ASC" : "DESC");
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedAlbumTypes([]);
    setDanceabilityLevel("any");
    setEnergyLevel("any");
    setValenceLevel("any");
    setPopularityLevel("any");
    setSort("stream");
    setOrder("DESC");
  };

  const applyFilters = () => {
    // Get selected range for each feature
    const danceabilityRange =
      danceabilityOptions.find((opt) => opt.value === danceabilityLevel) ||
      danceabilityOptions[0];
    const energyRange =
      energyOptions.find((opt) => opt.value === energyLevel) ||
      energyOptions[0];
    const valenceRange =
      valenceOptions.find((opt) => opt.value === valenceLevel) ||
      valenceOptions[0];
    const popularityRange =
      popularityOptions.find((opt) => opt.value === popularityLevel) ||
      popularityOptions[0];

    // Create a filter object
    const filters = {
      search,
      albumTypes: selectedAlbumTypes,
      minDanceability: danceabilityRange.min,
      maxDanceability: danceabilityRange.max,
      minEnergy: energyRange.min,
      maxEnergy: energyRange.max,
      minValence: valenceRange.min,
      maxValence: valenceRange.max,
      minStreams: popularityRange.min,
      maxStreams: popularityRange.max,
      sort,
      order,
    };

    onApplyFilters(filters);
  };

  return (
    <div className="p-6 overflow-hidden bg-white shadow-lg rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
        <h2 className="flex items-center text-xl font-semibold text-gray-800">
          <Sliders className="w-5 h-5 mr-2 text-blue-600" />
          Find Your Perfect Tracks
        </h2>
        <button
          onClick={resetFilters}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset All Filters
        </button>
      </div>

      <div className="space-y-6">
        {/* Search and Album Type */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Search - left column */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center mb-3">
              <Search className="w-4 h-4 mr-2 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-800">Search</h3>
            </div>
            <SearchFilterBar
              value={search}
              onChange={setSearch}
              onSearch={() => {}}
              placeholder="Artist, track or album..."
            />
          </div>

          {/* Album Type - right column */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <ButtonMultiSelect
              id="albumType"
              label="Album Type"
              icon={<Album size={16} />}
              options={allAlbumTypes.map((type) => ({
                value: type,
                label: type,
              }))}
              selectedValues={selectedAlbumTypes}
              onChange={handleMultiSelectChange}
            />
          </div>
        </div>

        {/* Sort By row spans both columns */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center mb-3">
            <ArrowDownUp className="w-4 h-4 mr-2 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-800">Sort By</h3>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <div className="flex-1">
              <ButtonMultiSelect
                id="sort"
                label=""
                options={sortOptions}
                selectedValues={[sort]}
                onChange={handleSortChange}
                allowMultiple={false}
              />
            </div>
            <button
              onClick={handleOrderToggle}
              className={`
                px-4 py-2 font-medium transition-colors border rounded-lg
                ${
                  order === "DESC"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }
              `}
            >
              {order === "DESC" ? "Highest First" : "Lowest First"}
            </button>
          </div>
        </div>

        {/* Audio Features */}
        <div className="p-5 bg-gray-50 rounded-xl">
          <h3 className="flex items-center mb-4 text-sm font-medium text-gray-800">
            <Music className="w-4 h-4 mr-2 text-blue-600" />
            Audio Features
          </h3>

          <div className="grid gap-x-6 gap-y-4 md:grid-cols-3">
            {/* Danceability buttons */}
            <ButtonRangeSelector
              id="danceability"
              label="Danceability"
              icon={<Activity size={16} />}
              options={danceabilityOptions}
              selectedValue={danceabilityLevel}
              onChange={handleRangeChange}
            />

            {/* Energy buttons */}
            <ButtonRangeSelector
              id="energy"
              label="Energy"
              icon={<Zap size={16} />}
              options={energyOptions}
              selectedValue={energyLevel}
              onChange={handleRangeChange}
            />

            {/* Valence (mood) buttons */}
            <ButtonRangeSelector
              id="valence"
              label="Mood"
              icon={<Smile size={16} />}
              options={valenceOptions}
              selectedValue={valenceLevel}
              onChange={handleRangeChange}
            />
          </div>
        </div>

        {/* Popularity */}
        <div className="p-5 bg-gray-50 rounded-xl">
          <h3 className="flex items-center mb-4 text-sm font-medium text-gray-800">
            <BarChart2 className="w-4 h-4 mr-2 text-blue-600" />
            Popularity
          </h3>

          <ButtonRangeSelector
            id="popularity"
            label="Stream Count"
            options={popularityOptions}
            selectedValue={popularityLevel}
            onChange={handleRangeChange}
          />
        </div>
      </div>

      {/* Apply filters button */}
      <div className="pt-6 mt-6 border-t border-gray-100">
        <button
          onClick={applyFilters}
          disabled={isLoading}
          className="flex items-center justify-center w-full px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              Finding Songs...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Find Songs
            </>
          )}
        </button>
      </div>
    </div>
  );
}

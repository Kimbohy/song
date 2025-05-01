"use client";

import { useState, useEffect, useMemo } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  PresentationChartBarIcon,
  MusicalNoteIcon as LoadingIcon,
} from "@heroicons/react/24/outline";

// Import components
import { DashboardHeader } from "@/components/dashboard/Header";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { ComparisonBanner } from "@/components/dashboard/ComparisonBanner";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { PerformanceTab } from "@/components/dashboard/PerformanceTab";
import { AudioFeaturesTab } from "@/components/dashboard/AudioFeaturesTab";
import { PlatformComparisonTab } from "@/components/dashboard/PlatformComparisonTab";
import { ArtistComparisonTab } from "@/components/dashboard/ArtistComparisonTab";

// Import types
import {
  SongData,
  FilterOptions,
  AudioFeature,
  ApiResponse,
} from "@/components/dashboard/types";
import { Text } from "@tremor/react";
import { SongDetailModal } from "@/components/SongDetailModal";

export default function Home() {
  // State
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSong, setSelectedSong] = useState<SongData | null>(null);
  const [songAudioFeatures, setSongAudioFeatures] = useState<Record<
    string,
    number
  > | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Advanced filtering
  const [filters, setFilters] = useState<FilterOptions>({
    artist: "",
    featureSort: "streams",
    minStreams: 0,
    limit: 20,
  });

  // Comparison feature
  const [compareMode, setCompareMode] = useState(false);
  const [comparedArtists, setComparedArtists] = useState<string[]>([]);

  // Data fetching
  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.artist) params.append("artist", filters.artist);
    if (filters.featureSort) params.append("sort", filters.featureSort);
    if (filters.minStreams)
      params.append("minStreams", filters.minStreams.toString());
    params.append("limit", filters.limit.toString());

    try {
      const response = await fetch("/api/stats?" + params.toString());
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  // Artist selection handling
  const handleArtistSelect = (artist: string) => {
    if (compareMode) {
      setComparedArtists((prev) =>
        prev.includes(artist)
          ? prev.filter((a) => a !== artist)
          : [...prev, artist].slice(0, 3)
      );
    } else {
      setFilters((prev) => ({ ...prev, artist: artist }));
    }
  };

  // Song details handling
  const fetchSongDetails = async (songId: number) => {
    // In a real app, this would fetch detailed song data
    // For now, using the selected song data
    setSongAudioFeatures({
      danceability: selectedSong?.danceability || 0.5,
      energy: selectedSong?.energy || 0.5,
      acousticness: selectedSong?.acousticness || 0.5,
      instrumentalness: selectedSong?.instrumentalness || 0.5,
      valence: selectedSong?.valence || 0.5,
    });
  };

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(num);

  const openSongDetails = (song: SongData) => {
    setSelectedSong(song);
    if (song.id) {
      fetchSongDetails(song.id);
    }
  };

  // Data transformations
  const summaryStats = useMemo(() => {
    if (!data) return null;

    const totalTracks = data.platformStats?.length || 0;
    const totalStreams =
      data.platformStats?.reduce(
        (sum, s) => sum + (s.spotify_streams || 0),
        0
      ) || 0;
    const totalViews =
      data.platformStats?.reduce((sum, s) => sum + (s.youtube_views || 0), 0) ||
      0;

    return {
      totalTracks,
      totalStreams,
      totalViews,
    };
  }, [data]);

  const audioFeaturesData = useMemo((): AudioFeature[] => {
    if (!data?.audioFeatures) return [];

    return [
      { name: "Danceability", value: data.audioFeatures.avg_danceability },
      { name: "Energy", value: data.audioFeatures.avg_energy },
      { name: "Valence", value: data.audioFeatures.avg_valence },
      { name: "Acousticness", value: data.audioFeatures.avg_acousticness },
      {
        name: "Instrumentalness",
        value: data.audioFeatures.avg_instrumentalness,
      },
      { name: "Liveness", value: data.audioFeatures.avg_liveness },
      { name: "Speechiness", value: data.audioFeatures.avg_speechiness },
    ];
  }, [data?.audioFeatures]);

  const correlationData = useMemo(() => {
    if (!data?.correlations) return [];

    // Take top 10 for better visualization
    return data.correlations.slice(0, 10).map((item) => ({
      ...item,
      viewsMillions: item.views / 1000000,
      streamsMillions: item.stream / 1000000,
    }));
  }, [data?.correlations]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <LoadingIcon className="w-16 h-16 text-blue-500" />
        </motion.div>
        <Text className="text-xl font-medium">
          Loading your music analytics...
        </Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <DashboardHeader
            showFilters={showFilters}
            compareMode={compareMode}
            setShowFilters={setShowFilters}
            setCompareMode={setCompareMode}
            refreshData={refreshData}
          />

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <FilterPanel
                show={showFilters}
                filters={filters}
                setFilters={setFilters}
                onClose={() => setShowFilters(false)}
                artists={data?.topArtists || []}
              />
            )}
          </AnimatePresence>

          {/* Comparison Banner */}
          <ComparisonBanner
            compareMode={compareMode}
            comparedArtists={comparedArtists}
            setComparedArtists={setComparedArtists}
          />

          {/* Summary Stats */}
          {!compareMode && summaryStats && (
            <SummaryStats
              totalTracks={summaryStats.totalTracks}
              totalStreams={summaryStats.totalStreams}
              totalViews={summaryStats.totalViews}
              formatNumber={formatNumber}
            />
          )}

          {/* Main Tabs */}
          <TabGroup
            onIndexChange={setActiveTab}
            index={activeTab}
            className="mt-6"
          >
            <TabList variant="solid">
              <Tab icon={ChartBarIcon}>Performance</Tab>
              <Tab icon={MusicalNoteIcon}>Audio Features</Tab>
              <Tab icon={VideoCameraIcon}>Platform Analysis</Tab>
              {compareMode && comparedArtists.length > 0 && (
                <Tab icon={PresentationChartBarIcon}>Artist Comparison</Tab>
              )}
            </TabList>

            <TabPanels>
              {/* Performance Tab */}
              <TabPanel>
                <PerformanceTab
                  topArtists={data?.topArtists || []}
                  genreAnalysis={data?.genreAnalysis || []}
                  correlationData={correlationData}
                  formatNumber={formatNumber}
                  compareMode={compareMode}
                  onArtistSelect={handleArtistSelect}
                />
              </TabPanel>

              {/* Audio Features Tab */}
              <TabPanel>
                <AudioFeaturesTab
                  audioFeaturesData={audioFeaturesData}
                  correlations={data?.correlations || []}
                  genreAnalysis={data?.genreAnalysis || []}
                  formatNumber={formatNumber}
                />
              </TabPanel>

              {/* Platform Analysis Tab */}
              <TabPanel>
                <PlatformComparisonTab
                  platformStats={data?.platformStats || []}
                  formatNumber={formatNumber}
                  onSongSelect={openSongDetails}
                />
              </TabPanel>

              {/* Artist Comparison Tab */}
              {compareMode && comparedArtists.length > 0 && (
                <TabPanel>
                  <ArtistComparisonTab
                    comparedArtists={comparedArtists}
                    topArtists={data?.topArtists || []}
                    formatNumber={formatNumber}
                  />
                </TabPanel>
              )}
            </TabPanels>
          </TabGroup>
        </motion.div>

        {/* Song Detail Modal using our component */}
        <SongDetailModal
          song={selectedSong}
          audioFeatures={songAudioFeatures}
          isOpen={!!selectedSong}
          onClose={() => setSelectedSong(null)}
          formatNumber={formatNumber}
        />
      </div>
    </div>
  );
}

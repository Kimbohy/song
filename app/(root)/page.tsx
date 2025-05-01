"use client";

import { useEffect, useState } from "react";
import { BarChart } from "@/components/charts/BarChart";
import SummaryStats from "@/components/dashboard/SummaryStats";
import DataModal from "@/components/charts/DataModal";
import { formatNumber } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardData {
  stats: {
    totalSongs: number;
    uniqueArtists: number;
    totalStreams: number;
    totalViews: number;
  };
  topArtists: any[];
  genreStats: any[];
  platformStats: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{
    data: Record<string, any>;
    type: "artist" | "genre" | "platform";
    title: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/stats");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleArtistClick = (itemData: any) => {
    setSelectedItem({
      data: itemData,
      type: "artist",
      title: itemData.artist,
    });
    // You could also navigate to the artist page
    // router.push(`/artists/${encodeURIComponent(itemData.artist)}`);
  };

  const handleGenreClick = (itemData: any) => {
    setSelectedItem({
      data: itemData,
      type: "genre",
      title: `${itemData.album_type} Stats`,
    });
  };

  const handlePlatformClick = (itemData: any) => {
    setSelectedItem({
      data: itemData,
      type: "platform",
      title: itemData.track,
    });
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Overview of your music analytics</p>
        </div>
      </div>

      <SummaryStats stats={data.stats} formatNumber={formatNumber} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Artists */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Top Artists by Streams</h2>
            <button
              onClick={() => router.push("/artists")}
              className="text-sm text-blue-600 flex items-center hover:underline"
            >
              View all <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            {data.topArtists.length > 0 ? (
              <BarChart
                data={data.topArtists}
                xKey="artist"
                yKey="total_streams"
                horizontal
                color="blue"
                onClick={handleArtistClick}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No artist data available
              </div>
            )}
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Album Type Distribution</h2>
            <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
              {data.genreStats.length} types
            </span>
          </div>
          <div className="relative">
            {data.genreStats.length > 0 ? (
              <BarChart
                data={data.genreStats}
                xKey="album_type"
                yKey="count"
                color="emerald"
                onClick={handleGenreClick}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No album type data available
              </div>
            )}
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Platform Performance</h2>
            <button
              onClick={() => router.push("/songs")}
              className="text-sm text-blue-600 flex items-center hover:underline"
            >
              View all songs <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            {data.platformStats.length > 0 ? (
              <BarChart
                data={data.platformStats.slice(0, 10)}
                xKey="track"
                yKey="spotify_streams"
                color="green"
                onClick={handlePlatformClick}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No platform data available
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <p className="text-xs text-gray-500 italic">
              Showing top 10 songs by Spotify streams
            </p>
          </div>
        </div>
      </div>

      {/* Modal for displaying detailed data */}
      {selectedItem && (
        <DataModal
          title={selectedItem.title}
          subtitle={
            selectedItem.type === "artist"
              ? "Artist Performance"
              : selectedItem.type === "genre"
              ? "Album Type Statistics"
              : "Track Performance"
          }
          data={selectedItem.data}
          onClose={closeModal}
          excludeKeys={["id"]}
        />
      )}
    </div>
  );
}

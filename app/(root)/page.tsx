"use client";

import { useEffect, useState } from "react";
import { BarChart } from "@/components/charts/BarChart";
import SummaryStats from "@/components/dashboard/SummaryStats";
import { formatNumber } from "@/lib/utils";

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Overview of your music analytics</p>
      </div>

      <SummaryStats stats={data.stats} formatNumber={formatNumber} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Artists */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Top Artists by Streams</h2>
          <BarChart
            data={data.topArtists}
            xKey="artist"
            yKey="total_streams"
            horizontal
            color="blue"
          />
        </div>

        {/* Genre Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            Album Type Distribution
          </h2>
          <BarChart
            data={data.genreStats}
            xKey="album_type"
            yKey="count"
            color="emerald"
          />
        </div>

        {/* Platform Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Platform Performance</h2>
          <BarChart
            data={data.platformStats.slice(0, 10)}
            xKey="track"
            yKey="spotify_streams"
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

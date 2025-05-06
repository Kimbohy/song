"use client";

import { useState } from "react";
import { Music2, PlayCircle, Youtube, User2 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart } from "@/components/charts/BarChart";
import { RadarChart } from "@/components/charts/RadarChart";
import { formatNumber } from "@/lib/utils";
import SongModal from "@/components/SongModal";

interface ArtistStats {
  artist: string;
  song_count: number;
  total_streams: number;
  total_views: number;
  avg_danceability: number;
  avg_energy: number;
  avg_valence: number;
  avg_acousticness: number;
  avg_instrumentalness: number;
}

interface Song {
  track: string;
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

// Create a type that extends Song and includes the required artist property
type SongWithArtist = Song & { artist: string };

interface ArtistDetailsProps {
  initialData: {
    artist: ArtistStats;
    songs: Song[];
    albumTypes: any[];
  };
}

export default function ArtistDetails({ initialData }: ArtistDetailsProps) {
  const [selectedSong, setSelectedSong] = useState<SongWithArtist | null>(null);
  const { artist, songs, albumTypes } = initialData;

  const handleSongSelect = (song: Song) => {
    setSelectedSong({
      ...song,
      artist: artist.artist,
    });
  };

  const audioFeatures = [
    { name: "Danceability", value: artist.avg_danceability },
    { name: "Energy", value: artist.avg_energy },
    { name: "Valence", value: artist.avg_valence },
    { name: "Acousticness", value: artist.avg_acousticness },
    { name: "Instrumentalness", value: artist.avg_instrumentalness },
  ];

  return (
    <div className="space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 rounded-full bg-indigo-50">
            <User2 className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{artist.artist}</h1>
            <p className="text-gray-600">Artist Statistics and Songs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500">Total Songs</p>
            <p className="text-2xl font-semibold">{artist.song_count}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500">Total Streams</p>
            <p className="text-2xl font-semibold">
              {formatNumber(artist.total_streams)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500">Total Views</p>
            <p className="text-2xl font-semibold">
              {formatNumber(artist.total_views)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500">Average Energy</p>
            <p className="text-2xl font-semibold">
              {(artist.avg_energy * 10).toFixed(1)}/10
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Audio Features</h2>
          <RadarChart data={audioFeatures} color="purple" fullMark={1} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Album Type Distribution
          </h2>
          <BarChart
            data={albumTypes}
            xKey="album_type"
            yKey="count"
            color="emerald"
          />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">Songs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                  Track
                </th>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                  Album
                </th>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                  Streams
                </th>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                  Views
                </th>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                  Danceability
                </th>
                <th className="px-4 py-2 text-sm font-medium text-left text-gray-500">
                  Energy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {songs.map((song) => (
                <motion.tr
                  key={song.track}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSongSelect(song)}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-4 py-2">{song.track}</td>
                  <td className="px-4 py-2">{song.album}</td>
                  <td className="px-4 py-2">{formatNumber(song.stream)}</td>
                  <td className="px-4 py-2">{formatNumber(song.views)}</td>
                  <td className="px-4 py-2">
                    {(song.danceability * 10).toFixed(1)}/10
                  </td>
                  <td className="px-4 py-2">
                    {(song.energy * 10).toFixed(1)}/10
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />
    </div>
  );
}

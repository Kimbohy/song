import {
  X,
  Play,
  Music,
  Activity,
  Radio,
  Heart,
  BarChart2,
  FileBadge,
  Mic2,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FilteredSongModalProps {
  song: Record<string, any> | null;
  onClose: () => void;
}

const FeatureBar = ({
  value,
  label,
  color = "bg-blue-500",
  description,
  displayValue,
}: {
  value: number;
  label: string;
  color?: string;
  description?: string;
  displayValue?: string | number;
}) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-sm font-semibold">
        {displayValue !== undefined
          ? displayValue
          : (value * 10).toFixed(1) + "/10"}
      </div>
    </div>
    <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
      <div
        className={`h-full ${color} rounded-full`}
        style={{
          width:
            typeof value === "number" ? `${Math.min(value * 100, 100)}%` : "0%",
        }}
      />
    </div>
    {/* {description && (
      <p className="mt-1 text-xs italic text-gray-500">{description}</p>
    )} */}
  </div>
);

// Helper function to convert key number to note name
const keyToNoteName = (keyNumber: number): string => {
  if (keyNumber === -1) return "No key detected";

  const notes = [
    "C",
    "C♯/D♭",
    "D",
    "D♯/E♭",
    "E",
    "F",
    "F♯/G♭",
    "G",
    "G♯/A♭",
    "A",
    "A♯/B♭",
    "B",
  ];
  return notes[keyNumber];
};

export default function FilteredSongModal({
  song,
  onClose,
}: FilteredSongModalProps) {
  if (!song) return null;

  const audioFeatureDescriptions = {
    danceability: "How suitable the track is for dancing",
    energy: "Represents intensity and activity",
    valence: "Musical positiveness (happiness) of the track",
    acousticness: "Confidence measure of whether the track is acoustic",
    instrumentalness: "Predicts whether the track contains no vocals",
  };

  // Format for millions/billions in a compact way
  const formatCompactNumber = (num: number) => {
    return formatNumber(num);
  };

  // Format duration from milliseconds to mm:ss
  const formatDuration = (ms: number | undefined): string => {
    if (!ms) return "—";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Helper function to determine if we need to format a value as n/10
  const shouldFormatAsRating = (feature: string): boolean => {
    return [
      "danceability",
      "energy",
      "valence",
      "acousticness",
      "instrumentalness",
    ].includes(feature);
  };

  // Helper function to get the appropriate color for each audio feature
  const getFeatureColor = (feature: string): string => {
    const colorMap: Record<string, string> = {
      danceability: "bg-blue-500",
      energy: "bg-red-500",
      valence: "bg-yellow-500",
      acousticness: "bg-green-500",
      instrumentalness: "bg-indigo-500",
    };
    return colorMap[feature] || "bg-gray-500";
  };

  // Helper function to format feature value for display
  const formatFeatureValue = (
    feature: string,
    value: number
  ): string | number => {
    if (feature === "tempo") {
      return `${Math.round(value)} BPM`;
    }
    if (feature === "key") {
      return keyToNoteName(value);
    }
    return shouldFormatAsRating(feature)
      ? `${(value * 10).toFixed(1)}/10`
      : value.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-5xl mx-4 overflow-hidden bg-white shadow-2xl rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute z-10 p-2 transition-colors rounded-full shadow-md top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Improved header */}
        <div className="border-b border-gray-200 p-7">
          <div className="flex items-center">
            {/* Album art placeholder */}
            <div className="flex items-center justify-center w-20 h-20 mr-5 text-white rounded-lg shadow-md bg-gradient-to-br from-indigo-500 to-purple-600">
              <Music className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex gap-2 mb-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full 
                  ${
                    song.album_type === "single"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {song.album_type || "Unknown"}
                </span>
                {song.official_video && (
                  <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                    Official Video
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{song.track}</h1>
              <p className="text-lg text-gray-600">
                {song.artist} •{" "}
                {song.album && (
                  <span className="text-gray-500">{song.album}</span>
                )}
              </p>
            </div>
          </div>

          {/* Streamlined stats boxes */}
          <div className="flex flex-wrap gap-3 mt-5">
            {/* Duration */}
            {song.duration_ms && (
              <div className="flex items-center px-3 py-2 space-x-2 bg-gray-100 rounded-lg">
                <FileBadge className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {formatDuration(song.duration_ms)}
                </span>
              </div>
            )}

            {/* Tempo */}
            {song.tempo && (
              <div className="flex items-center px-3 py-2 space-x-2 bg-purple-100 rounded-lg">
                <Activity className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  {Math.round(song.tempo)} BPM
                </span>
              </div>
            )}

            {/* Key */}
            {typeof song.song_key !== "undefined" && song.song_key >= -1 && (
              <div className="flex items-center px-3 py-2 space-x-2 rounded-lg bg-emerald-100">
                <Music className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {keyToNoteName(song.song_key)}
                </span>
              </div>
            )}

            {/* Stream count */}
            <div className="flex items-center px-3 py-2 space-x-2 bg-blue-100 rounded-lg">
              <Music className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {formatCompactNumber(song.stream || 0)}
              </span>
            </div>

            {/* View count */}
            <div className="flex items-center px-3 py-2 space-x-2 bg-red-100 rounded-lg">
              <Play className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                {formatCompactNumber(song.views || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
          {/* Left column - Audio features */}
          <div>
            <h2 className="flex items-center pb-2 mb-4 text-lg font-semibold border-b border-gray-200">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Audio Features
            </h2>

            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
              <div>
                {/* First column of features - no key or tempo */}
                {["danceability", "energy", "valence"].map((feature) => {
                  return (
                    <FeatureBar
                      key={feature}
                      value={song[feature] || 0}
                      label={feature.charAt(0).toUpperCase() + feature.slice(1)}
                      color={getFeatureColor(feature)}
                      description={
                        audioFeatureDescriptions[
                          feature as keyof typeof audioFeatureDescriptions
                        ]
                      }
                      displayValue={formatFeatureValue(
                        feature,
                        song[feature] || 0
                      )}
                    />
                  );
                })}
              </div>

              <div>
                {/* Second column of features - no key or tempo */}
                {["acousticness", "instrumentalness"].map((feature) => {
                  return (
                    <FeatureBar
                      key={feature}
                      value={song[feature] || 0}
                      label={feature.charAt(0).toUpperCase() + feature.slice(1)}
                      color={getFeatureColor(feature)}
                      description={
                        audioFeatureDescriptions[
                          feature as keyof typeof audioFeatureDescriptions
                        ]
                      }
                      displayValue={formatFeatureValue(
                        feature,
                        song[feature] || 0
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* External links */}
            <div className="flex gap-3 mt-6">
              {song.url_spotify && (
                <a
                  href={song.url_spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center flex-1 gap-1 px-4 py-2 text-sm text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <FontAwesomeIcon
                    icon={faSpotify}
                    style={{ color: "#ffffff" }}
                    size="2xl"
                  />
                  Listen on Spotify
                </a>
              )}

              {song.url_youtube && (
                <a
                  href={song.url_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center flex-1 gap-1 px-4 py-2 text-sm text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <FontAwesomeIcon
                    icon={faYoutube}
                    style={{ color: "#ffffff" }}
                    size="2xl"
                  />
                  Watch on YouTube
                </a>
              )}
            </div>
          </div>

          {/* Right column - metrics and other info */}
          <div>
            <h2 className="flex items-center pb-2 mb-4 text-lg font-semibold border-b border-gray-200">
              <BarChart2 className="w-5 h-5 mr-2 text-blue-600" />
              Engagement Metrics
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Streams card */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Spotify Streams</p>
                    <p className="mt-1 text-xl font-bold">
                      {formatCompactNumber(song.stream || 0)}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Music className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Views card */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">YouTube Views</p>
                    <p className="mt-1 text-xl font-bold">
                      {formatCompactNumber(song.views || 0)}
                    </p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-full">
                    <Play className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Likes card */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Likes</p>
                    <p className="mt-1 text-xl font-bold">
                      {formatCompactNumber(song.likes || 0)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {song.views && song.likes
                        ? `${((song.likes / song.views) * 100).toFixed(
                            1
                          )}% engagement`
                        : "No data"}
                    </p>
                  </div>
                  <div className="p-2 bg-pink-100 rounded-full">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                </div>
              </div>

              {/* Comments card */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Comments</p>
                    <p className="mt-1 text-xl font-bold">
                      {formatCompactNumber(song.comments || 0)}
                    </p>
                  </div>
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Mic2 className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube channel info */}
            {song.channel && (
              <div className="p-4 mt-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">YouTube Channel</p>
                <p className="mt-1 font-medium truncate">{song.channel}</p>
                {song.licensed !== undefined && (
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full 
                      ${
                        song.licensed
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {song.licensed
                        ? "Licensed Content"
                        : "Non-Licensed Content"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 font-medium text-gray-800 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

import {
  X,
  Music,
  PlayCircle,
  ThumbsUp,
  MessageCircle,
  Music2,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";

interface SongDetails {
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

interface SongModalProps {
  song: SongDetails | null;
  onClose: () => void;
}

export default function SongModal({ song, onClose }: SongModalProps) {
  if (!song) return null;

  const metrics = [
    { name: "Danceability", value: song.danceability },
    { name: "Energy", value: song.energy },
    { name: "Valence", value: song.valence },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl p-8 mx-4 bg-white shadow-2xl rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
              {song.track}
            </h2>
            <p className="text-lg text-gray-600">{song.artist}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Album Information</h3>
              </div>
              <p className="font-medium text-gray-800">{song.album}</p>
              <p className="text-sm text-gray-500 capitalize">
                {song.album_type}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Performance Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-gray-600">Streams</p>
                  </div>
                  <p className="text-lg font-medium">
                    {formatNumber(song.stream)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                  <p className="text-lg font-medium">
                    {formatNumber(song.views)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-blue-500" />
                    <p className="text-sm text-gray-600">Likes</p>
                  </div>
                  <p className="text-lg font-medium">
                    {formatNumber(song.likes)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-indigo-500" />
                    <p className="text-sm text-gray-600">Comments</p>
                  </div>
                  <p className="text-lg font-medium">
                    {formatNumber(song.comments)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="mb-6 font-semibold">Audio Features</h3>
            <div className="space-y-6">
              {metrics.map((metric) => (
                <div key={metric.name}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-gray-600">{metric.name}</span>
                    <span className="font-medium">
                      {Math.round(metric.value * 100)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          {song.url_spotify && (
            <a
              href={song.url_spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-center text-white transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700"
            >
              <FontAwesomeIcon icon={faSpotify} style={{ color: "#ffffff" }} size="lg" />
              Open in Spotify
            </a>
          )}
          {song.url_youtube && (
            <a
              href={song.url_youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-center text-white transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700"
            >
              <FontAwesomeIcon icon={faYoutube} style={{ color: "#ffffff" }} size="lg" />
              Watch on YouTube
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

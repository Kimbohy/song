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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {song.track}
            </h2>
            <p className="text-gray-600 text-lg">{song.artist}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Music className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Album Information</h3>
              </div>
              <p className="text-gray-800 font-medium">{song.album}</p>
              <p className="text-sm text-gray-500 capitalize">
                {song.album_type}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Performance Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Music2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm text-gray-600">Streams</p>
                  </div>
                  <p className="font-medium text-lg">
                    {formatNumber(song.stream)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                  <p className="font-medium text-lg">
                    {formatNumber(song.views)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-blue-500" />
                    <p className="text-sm text-gray-600">Likes</p>
                  </div>
                  <p className="font-medium text-lg">
                    {formatNumber(song.likes)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-indigo-500" />
                    <p className="text-sm text-gray-600">Comments</p>
                  </div>
                  <p className="font-medium text-lg">
                    {formatNumber(song.comments)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold mb-6">Audio Features</h3>
            <div className="space-y-6">
              {metrics.map((metric) => (
                <div key={metric.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{metric.name}</span>
                    <span className="font-medium">
                      {Math.round(metric.value * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          {song.url_spotify && (
            <a
              href={song.url_spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl text-center hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <FontAwesomeIcon icon={faSpotify} style={{ color: "#ffffff" }} />
              Open in Spotify
            </a>
          )}
          {song.url_youtube && (
            <a
              href={song.url_youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl text-center hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <FontAwesomeIcon icon={faYoutube} style={{ color: "#ffffff" }} />
              Watch on YouTube
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

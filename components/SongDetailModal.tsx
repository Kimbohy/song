import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { Text } from "@tremor/react";
import { SongData } from "./dashboard/types";

interface SongDetailModalProps {
  song: SongData | null;
  audioFeatures: Record<string, number> | null;
  isOpen: boolean;
  onClose: () => void;
  formatNumber: (value: number) => string;
}

export const SongDetailModal = ({
  song,
  audioFeatures,
  isOpen,
  onClose,
  formatNumber,
}: SongDetailModalProps) => {
  if (!song) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl"
        >
          <Dialog.Panel className="mx-auto rounded-xl bg-white p-6 shadow-2xl">
            <Dialog.Title className="text-xl font-bold mb-1">
              {song.track}
            </Dialog.Title>
            <Dialog.Description className="text-gray-500 mb-4">
              by {song.artist} {song.album && `· ${song.album}`}
            </Dialog.Description>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <Text className="font-semibold">Spotify Streams</Text>
                <Text className="text-xl font-bold">
                  {formatNumber(song.spotify_streams)}
                </Text>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <Text className="font-semibold">YouTube Views</Text>
                <Text className="text-xl font-bold">
                  {formatNumber(song.youtube_views)}
                </Text>
              </div>
            </div>

            {song.youtube_likes !== undefined &&
              song.youtube_comments !== undefined && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <Text className="font-semibold">YouTube Likes</Text>
                    <Text className="text-xl font-bold">
                      {formatNumber(song.youtube_likes)}
                    </Text>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Text className="font-semibold">YouTube Comments</Text>
                    <Text className="text-xl font-bold">
                      {formatNumber(song.youtube_comments)}
                    </Text>
                  </div>
                </div>
              )}

            {audioFeatures && (
              <div className="mb-6">
                <Text className="font-semibold mb-2">Audio Features</Text>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.entries(audioFeatures).map(([key, value]) => (
                    <div
                      key={key}
                      className="text-center p-2 bg-blue-50 rounded"
                    >
                      <Text className="text-xs uppercase">{key}</Text>
                      <Text className="font-bold">{value.toFixed(2)}</Text>
                      <div
                        className="h-1 bg-gray-200 rounded-full overflow-hidden mt-1"
                        title={`${key}: ${value.toFixed(2)}`}
                      >
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(value || 0) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              {song.url_spotify && (
                <a
                  href={song.url_spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Open in Spotify
                </a>
              )}

              {song.url_youtube && (
                <a
                  href={song.url_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Watch on YouTube
                </a>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </motion.div>
      </div>
    </Dialog>
  );
};

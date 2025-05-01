import { X } from "lucide-react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

interface DataModalProps {
  title: string;
  subtitle?: string;
  data: Record<string, any> | null;
  onClose: () => void;
  excludeKeys?: string[];
}

export default function DataModal({
  title,
  subtitle,
  data,
  onClose,
  excludeKeys = [],
}: DataModalProps) {
  if (!data) return null;

  // Filter out keys we don't want to display and format the rest
  const entries = Object.entries(data)
    .filter(([key]) => !excludeKeys.includes(key))
    .map(([key, value]) => {
      const formattedKey = key
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        key: formattedKey,
        value: typeof value === "number" ? formatNumber(value) : value,
      };
    });

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
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {title}
            </h2>
            {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="divide-y divide-gray-200">
            {entries.map(({ key, value }) => (
              <div key={key} className="py-3 flex justify-between">
                <span className="text-gray-600">{key}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

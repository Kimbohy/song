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

      // Check if the key contains "avg" or "average" to format as n/10
      const isAverageValue =
        key.toLowerCase().includes("avg") ||
        key.toLowerCase().includes("average");

      let formattedValue = value;
      if (typeof value === "number") {
        if (isAverageValue && value >= 0 && value <= 1) {
          // Format average values as n/10
          formattedValue = `${(value * 10).toFixed(1)}/10`;
        } else {
          // Use the standard number formatting for other numbers
          formattedValue = formatNumber(value);
        }
      }

      return {
        key: formattedKey,
        value: formattedValue,
      };
    });

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
            <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
              {title}
            </h2>
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="divide-y divide-gray-200">
            {entries.map(({ key, value }) => (
              <div key={key} className="flex justify-between py-3">
                <span className="text-gray-600">{key}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

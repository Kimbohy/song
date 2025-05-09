import { motion } from "framer-motion";
import { Music, Users, PlayCircle, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  stats: {
    totalSongs: number;
    uniqueArtists: number;
    totalStreams: number;
    totalViews: number;
  };
  formatNumber: (num: number) => string;
}

export default function SummaryStats({ stats, formatNumber }: Props) {
  const router = useRouter();

  const stats_config = [
    {
      label: "Total Songs",
      value: stats.totalSongs,
      icon: Music,
      color: "bg-blue-500",
      redirectTo: "/songs",
    },
    {
      label: "Unique Artists",
      value: stats.uniqueArtists,
      icon: Users,
      color: "bg-emerald-500",
      redirectTo: "/artists",
    },
    {
      label: "Spotify Streams",
      value: stats.totalStreams,
      icon: PlayCircle,
      color: "bg-green-500",
    },
    {
      label: "YouTube Views",
      value: stats.totalViews,
      icon: Youtube,
      color: "bg-red-500",
    },
  ];

  const handleCardClick = (redirectTo?: string) => {
    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats_config.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`p-6 bg-white rounded-lg shadow-sm ${
            stat.redirectTo ? "cursor-pointer" : ""
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={stat.redirectTo ? { scale: 1.02 } : undefined}
          whileTap={stat.redirectTo ? { scale: 0.98 } : undefined}
          onClick={() => handleCardClick(stat.redirectTo)}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold">
                {formatNumber(stat.value)}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

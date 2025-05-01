import { Title, Text, Button } from "@tremor/react";
import {
  ArrowPathIcon,
  FunnelIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";

interface HeaderProps {
  showFilters: boolean;
  compareMode: boolean;
  setShowFilters: (show: boolean) => void;
  setCompareMode: (compare: boolean) => void;
  refreshData: () => void;
}

export const DashboardHeader = ({
  showFilters,
  compareMode,
  setShowFilters,
  setCompareMode,
  refreshData,
}: HeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <Title className="text-3xl font-bold text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
          Music Analytics Dashboard
        </Title>
        <Text className="text-center md:text-left text-slate-600">
          Interactive insights into streaming performance across platforms
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Button icon={ArrowPathIcon} onClick={refreshData}>
          Refresh
        </Button>
        <Button
          icon={FunnelIcon}
          color={showFilters ? "blue" : "gray"}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
        <Button
          icon={PresentationChartBarIcon}
          color={compareMode ? "amber" : "gray"}
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? "Exit Compare" : "Compare"}
        </Button>
      </div>
    </header>
  );
};

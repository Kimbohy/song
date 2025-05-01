import { Callout } from "@tremor/react";
import {
  PresentationChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ComparisonBannerProps {
  compareMode: boolean;
  comparedArtists: string[];
  setComparedArtists: (artists: string[]) => void;
}

export const ComparisonBanner = ({
  compareMode,
  comparedArtists,
  setComparedArtists,
}: ComparisonBannerProps) => {
  if (!compareMode) return null;

  return (
    <Callout
      title="Comparison Mode"
      color="amber"
      icon={PresentationChartBarIcon}
      className="mt-4"
    >
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <span className="text-sm">
          Click on artist charts to select up to 3 artists to compare.
        </span>
        <div className="flex flex-wrap gap-2 ml-auto">
          {comparedArtists.map((artist) => (
            <span
              key={artist}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
              onClick={() =>
                setComparedArtists(comparedArtists.filter((a) => a !== artist))
              }
            >
              {artist}
              <XMarkIcon className="w-4 h-4 ml-1 cursor-pointer" />
            </span>
          ))}
          {comparedArtists.length === 0 && (
            <span className="text-sm italic text-slate-500">
              No artists selected
            </span>
          )}
        </div>
      </div>
    </Callout>
  );
};

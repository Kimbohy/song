import { motion } from "framer-motion";
import {
  Card,
  Flex,
  Title,
  Grid,
  Select,
  SelectItem,
  Button,
} from "@tremor/react";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface FilterOptions {
  artist: string;
  featureSort: string;
  minStreams: number;
  limit: number;
}

interface FilterPanelProps {
  show: boolean;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  onClose: () => void;
  artists: Array<{ artist: string }>;
}

export const FilterPanel = ({
  show,
  filters,
  setFilters,
  onClose,
  artists,
}: FilterPanelProps) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <Card className="bg-white/90 backdrop-blur">
        <Flex justifyContent="between" alignItems="center" className="mb-4">
          <Title>Data Filters</Title>
          <Button icon={XMarkIcon} color="gray" onClick={onClose} />
        </Flex>

        <Grid numItemsSm={1} numItemsMd={2} numItemsLg={4} className="gap-4">
          <Select
            value={filters.artist}
            onValueChange={(value) => setFilters({ ...filters, artist: value })}
            placeholder="Filter by Artist"
          >
            <SelectItem value="" icon={XMarkIcon}>
              All Artists
            </SelectItem>
            {artists?.map((artist) => (
              <SelectItem key={artist.artist} value={artist.artist}>
                {artist.artist}
              </SelectItem>
            ))}
          </Select>

          <Select
            value={filters.featureSort}
            onValueChange={(value) =>
              setFilters({ ...filters, featureSort: value })
            }
            placeholder="Sort by"
          >
            <SelectItem value="streams">Spotify Streams</SelectItem>
            <SelectItem value="views">YouTube Views</SelectItem>
            <SelectItem value="danceability">Danceability</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
            <SelectItem value="valence">Valence</SelectItem>
          </Select>

          <Select
            value={String(filters.limit)}
            onValueChange={(value) =>
              setFilters({ ...filters, limit: parseInt(value) })
            }
            placeholder="Result limit"
          >
            <SelectItem value="10">10 Results</SelectItem>
            <SelectItem value="20">20 Results</SelectItem>
            <SelectItem value="50">50 Results</SelectItem>
            <SelectItem value="100">100 Results</SelectItem>
          </Select>

          <Button
            className="mt-auto"
            onClick={() =>
              setFilters({
                artist: "",
                featureSort: "streams",
                minStreams: 0,
                limit: 20,
              })
            }
          >
            Reset Filters
          </Button>
        </Grid>
      </Card>
    </motion.div>
  );
};

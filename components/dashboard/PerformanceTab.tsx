import { Card, Title, Text, Flex, Grid, BadgeDelta } from "@tremor/react";

// Import our chart components
import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";
import { AreaChart } from "../charts/AreaChart";

interface PerformanceTabProps {
  topArtists: any[];
  genreAnalysis: any[];
  correlationData: any[];
  formatNumber: (num: number) => string;
  compareMode: boolean;
  onArtistSelect: (artist: string) => void;
}

export const PerformanceTab = ({
  topArtists,
  genreAnalysis,
  correlationData,
  formatNumber,
  compareMode,
  onArtistSelect,
}: PerformanceTabProps) => {
  return (
    <Grid numItemsSm={1} numItemsMd={2} className="gap-6 mt-6">
      <Card className="hover:shadow-md transition-shadow">
        <Flex alignItems="center" justifyContent="between" className="mb-4">
          <div>
            <Title>Top Artists by Streams</Title>
            <Text className="text-gray-500">
              Click on bars to filter or compare artists
            </Text>
          </div>
          {compareMode && (
            <BadgeDelta deltaType="increase" size="xs">
              Click to Compare
            </BadgeDelta>
          )}
        </Flex>

        <div className="h-80 mt-4">
          <BarChart
            data={topArtists || []}
            xKey="artist"
            yKey="avg_streams"
            color="blue"
            formatValue={formatNumber}
            onClick={(v) => {
              if (v && v.artist) {
                onArtistSelect(v.artist);
              }
            }}
          />
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <Title>Genre Distribution</Title>
        <Text className="text-gray-500">Based on audio features analysis</Text>

        <div className="h-80 mt-4">
          <PieChart
            data={
              genreAnalysis.map((item) => ({
                name: item.predicted_genre,
                value: item.track_count,
              })) || []
            }
            nameKey="name"
            dataKey="value"
            innerRadius={50}
            outerRadius={90}
            colors={["blue", "cyan", "indigo", "violet", "purple", "fuchsia"]}
            formatValue={formatNumber}
          />
        </div>
      </Card>

      <Card className="md:col-span-2 hover:shadow-md transition-shadow">
        <Flex alignItems="start" justifyContent="between" className="mb-4">
          <div>
            <Title>Streaming Performance Over Time</Title>
            <Text className="text-gray-500">Track popularity trends</Text>
          </div>
        </Flex>

        <div className="h-80 mt-4">
          <AreaChart
            data={correlationData}
            xKey="track"
            yKeys={["streamsMillions", "viewsMillions"]}
            colors={["blue", "red"]}
            formatValue={(value) => `${value.toFixed(1)}M`}
          />
        </div>
      </Card>
    </Grid>
  );
};

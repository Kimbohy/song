import {
  Card,
  Title,
  Text,
  Grid,
  BarChart,
  ScatterChart,
  Callout,
} from "@tremor/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface AudioFeaturesTabProps {
  audioFeaturesData: any[];
  correlations: any[];
  genreAnalysis: any[];
  formatNumber: (num: number) => string;
}

export const AudioFeaturesTab = ({
  audioFeaturesData,
  correlations,
  genreAnalysis,
  formatNumber,
}: AudioFeaturesTabProps) => {
  return (
    <Grid numItemsSm={1} numItemsMd={2} className="gap-6 mt-6">
      <Card className="hover:shadow-md transition-shadow">
        <Title>Audio Features Analysis</Title>
        <Text className="text-gray-500">
          Average values across selected tracks
        </Text>

        <BarChart
          className="h-80 mt-4"
          data={audioFeaturesData}
          index="name"
          categories={["value"]}
          colors={["indigo"]}
          valueFormatter={(value) => value.toFixed(2)}
          layout="vertical"
          yAxisWidth={120}
        />

        <Callout
          className="mt-4"
          title="About Audio Features"
          color="blue"
          icon={InformationCircleIcon}
        >
          Values range from 0 to 1, with higher values indicating stronger
          presence of the feature.
        </Callout>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <Title>Feature Correlation</Title>
        <Text className="text-gray-500">
          Relationship between audio features and popularity
        </Text>

        <ScatterChart
          className="h-80 mt-4"
          data={correlations || []}
          category="stream"
          x="danceability"
          y="energy"
          size="stream"
          colors={["blue"]}
          valueFormatter={{
            x: (value) => value.toFixed(2),
            y: (value) => value.toFixed(2),
            size: (value) => formatNumber(value),
          }}
        />

        <Text className="mt-2 text-center text-sm text-gray-500">
          Danceability vs Energy (bubble size represents stream count)
        </Text>
      </Card>

      <Card className="md:col-span-2 hover:shadow-md transition-shadow">
        <Title>Audio Feature Impact on Streaming Performance</Title>
        <Text className="text-gray-500">
          How audio features correlate with stream counts
        </Text>

        <BarChart
          className="h-80 mt-4"
          data={[
            {
              name: "High Danceability",
              value:
                genreAnalysis?.find(
                  (g: any) => g.predicted_genre === "Dance/Electronic"
                )?.avg_streams || 0,
            },
            {
              name: "High Energy",
              value:
                genreAnalysis?.find(
                  (g: any) => g.predicted_genre === "Rock/Metal"
                )?.avg_streams || 0,
            },
            {
              name: "High Acousticness",
              value:
                genreAnalysis?.find(
                  (g: any) => g.predicted_genre === "Acoustic"
                )?.avg_streams || 0,
            },
            {
              name: "High Instrumentalness",
              value:
                genreAnalysis?.find(
                  (g: any) => g.predicted_genre === "Instrumental"
                )?.avg_streams || 0,
            },
            {
              name: "High Speechiness",
              value:
                genreAnalysis?.find(
                  (g: any) => g.predicted_genre === "Hip Hop/Rap"
                )?.avg_streams || 0,
            },
          ]}
          index="name"
          categories={["value"]}
          colors={["purple"]}
          valueFormatter={formatNumber}
        />
      </Card>
    </Grid>
  );
};

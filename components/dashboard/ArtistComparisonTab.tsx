import { Card, Title, Text, Grid } from "@tremor/react";
import { RadarChart } from "../charts/RadarChart";
import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";

interface ArtistComparisonTabProps {
  comparedArtists: string[];
  topArtists: any[];
  formatNumber: (num: number) => string;
}

export const ArtistComparisonTab = ({
  comparedArtists,
  topArtists,
  formatNumber,
}: ArtistComparisonTabProps) => {
  // Prepare data for the RadarChart
  const audioFeatures = [
    "Danceability",
    "Energy",
    "Valence",
    "Acousticness",
    "Instrumentalness",
  ];

  const radarData = comparedArtists.map((artist) => {
    const artistData = topArtists?.find((a: any) => a.artist === artist);
    return {
      name: artist,
      Danceability: artistData?.avg_danceability || 0,
      Energy: artistData?.avg_energy || 0,
      Valence: artistData?.avg_valence || 0,
      Acousticness: artistData?.avg_acousticness || 0,
      Instrumentalness: artistData?.avg_instrumentalness || 0,
    };
  });

  // Prepare data for the BarChart
  const streamingData = comparedArtists.map((artist) => {
    const artistData = topArtists?.find((a: any) => a.artist === artist);
    return {
      name: artist,
      value: artistData?.avg_streams || 0,
    };
  });

  // Prepare data for the PieChart
  const songCountData = comparedArtists.map((artist) => {
    const artistData = topArtists?.find((a: any) => a.artist === artist);
    return {
      name: artist,
      value: artistData?.song_count || 0,
    };
  });

  return (
    <Grid numItemsSm={1} numItemsMd={2} className="gap-6 mt-6">
      <Card className="md:col-span-2 hover:shadow-md transition-shadow">
        <Title>Artist Audio Features Comparison</Title>
        <Text className="text-gray-500">
          Comparing {comparedArtists.length} artists' audio characteristics
        </Text>

        <RadarChart
          data={radarData}
          keys={audioFeatures}
          indexBy="name"
          height={400}
          valueFormat={(value) => value.toFixed(2)}
          showGrid={true}
        />
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <Title>Streaming Performance</Title>
        <Text className="text-gray-500">Average streams per track</Text>

        <div className="h-80">
          <BarChart
            data={streamingData}
            xKey="name"
            yKey="value"
            showGrid={true}
            formatValue={formatNumber}
            color="emerald"
          />
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <Title>Track Count Distribution</Title>
        <Text className="text-gray-500">Number of tracks per artist</Text>

        <div className="h-80">
          <PieChart
            data={songCountData}
            nameKey="name"
            dataKey="value"
            colors={["blue", "amber", "green", "red"]}
            formatValue={(value) => value.toString()}
          />
        </div>
      </Card>
    </Grid>
  );
};

import { Grid, Card, Text, Metric } from "@tremor/react";

interface SummaryStatsProps {
  totalTracks: number;
  totalStreams: number;
  totalViews: number;
  formatNumber: (num: number) => string;
}

export const SummaryStats = ({
  totalTracks,
  totalStreams,
  totalViews,
  formatNumber,
}: SummaryStatsProps) => {
  return (
    <Grid numItemsSm={2} numItemsMd={3} className="gap-4">
      <Card decoration="top" decorationColor="blue">
        <Text>Total Tracks</Text>
        <Metric>{totalTracks}</Metric>
      </Card>
      <Card decoration="top" decorationColor="green">
        <Text>Spotify Streams</Text>
        <Metric>{formatNumber(totalStreams)}</Metric>
      </Card>
      <Card decoration="top" decorationColor="red">
        <Text>YouTube Views</Text>
        <Metric>{formatNumber(totalViews)}</Metric>
      </Card>
    </Grid>
  );
};

import {
  Card,
  Title,
  Text,
  Flex,
  Grid,
  ScatterChart,
  BarChart,
  Metric,
} from "@tremor/react";
import {
  SparklesIcon,
  PlayIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface SongData {
  id?: number;
  artist: string;
  track: string;
  spotify_streams: number;
  youtube_views: number;
  youtube_likes?: number;
  youtube_comments?: number;
}

interface PlatformComparisonTabProps {
  platformStats: SongData[];
  formatNumber: (num: number) => string;
  onSongSelect: (song: SongData) => void;
}

export const PlatformComparisonTab = ({
  platformStats,
  formatNumber,
  onSongSelect,
}: PlatformComparisonTabProps) => {
  const calculateAverage = (key: keyof SongData) => {
    if (!platformStats?.length) return 0;
    return (
      platformStats.reduce((sum, s) => sum + (Number(s[key]) || 0), 0) /
      platformStats.length
    );
  };

  return (
    <Grid numItemsSm={1} numItemsMd={2} className="gap-6 mt-6">
      <Card className="md:col-span-2 hover:shadow-md transition-shadow">
        <Flex alignItems="start" justifyContent="between" className="mb-4">
          <div>
            <Title>Spotify vs YouTube Performance</Title>
            <Text className="text-gray-500">
              Platform performance comparison
            </Text>
          </div>
        </Flex>

        <ScatterChart
          className="h-80 mt-4"
          data={platformStats?.slice(0, 15) || []}
          category="artist"
          x="spotify_streams"
          y="youtube_views"
          size="spotify_streams"
          colors={["emerald"]}
          valueFormatter={{
            x: (value) => formatNumber(value),
            y: (value) => formatNumber(value),
          }}
        />

        <Text className="mt-2 text-center text-sm text-gray-500">
          Spotify Streams vs YouTube Views (hover for details)
        </Text>
      </Card>

      <Card className="hover:shadow-md transition-shadow overflow-hidden">
        <Title>Platform Performance Breakdown</Title>
        <Text className="text-gray-500">
          Click on a track for detailed stats
        </Text>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-2 text-gray-600">Track</th>
                <th className="text-left p-2 text-gray-600">Artist</th>
                <th className="text-right p-2 text-gray-600">
                  <Flex
                    justifyContent="end"
                    alignItems="center"
                    className="gap-1"
                  >
                    <SparklesIcon className="h-4 w-4 text-green-500" />
                    Spotify
                  </Flex>
                </th>
                <th className="text-right p-2 text-gray-600">
                  <Flex
                    justifyContent="end"
                    alignItems="center"
                    className="gap-1"
                  >
                    <PlayIcon className="h-4 w-4 text-red-500" />
                    YouTube
                  </Flex>
                </th>
              </tr>
            </thead>
            <tbody>
              {platformStats?.slice(0, 10).map((song, index) => (
                <tr
                  key={`${song.artist}-${song.track}-${index}`}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSongSelect(song)}
                >
                  <td className="p-2 max-w-[180px] truncate" title={song.track}>
                    {song.track}
                  </td>
                  <td
                    className="p-2 max-w-[120px] truncate"
                    title={song.artist}
                  >
                    {song.artist}
                  </td>
                  <td className="text-right p-2">
                    {formatNumber(song.spotify_streams)}
                  </td>
                  <td className="text-right p-2">
                    {formatNumber(song.youtube_views)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <Title>Engagement Metrics</Title>
        <Text className="text-gray-500">YouTube engagement analysis</Text>

        <Grid numItemsSm={2} numItemsMd={2} className="gap-4 mt-4">
          <Card decoration="left" decorationColor="red">
            <Flex>
              <HeartIcon className="h-8 w-8 text-red-500" />
              <div className="ml-2">
                <Text>Average Likes</Text>
                <Metric>
                  {formatNumber(calculateAverage("youtube_likes"))}
                </Metric>
              </div>
            </Flex>
          </Card>

          <Card decoration="left" decorationColor="blue">
            <Flex>
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-2">
                <Text>Average Comments</Text>
                <Metric>
                  {formatNumber(calculateAverage("youtube_comments"))}
                </Metric>
              </div>
            </Flex>
          </Card>
        </Grid>

        <BarChart
          className="h-60 mt-4"
          data={platformStats?.slice(0, 5) || []}
          index="track"
          categories={["youtube_likes", "youtube_comments"]}
          colors={["red", "blue"]}
          valueFormatter={formatNumber}
          layout="vertical"
          yAxisWidth={65}
        />
      </Card>
    </Grid>
  );
};

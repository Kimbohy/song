export interface SongData {
  id?: number;
  artist: string;
  track: string;
  album?: string;
  spotify_streams: number;
  youtube_views: number;
  youtube_likes?: number;
  youtube_comments?: number;
  danceability?: number;
  energy?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  url_spotify?: string;
  url_youtube?: string;
}

export interface FilterOptions {
  artist: string;
  featureSort: string;
  minStreams: number;
  limit: number;
}

export interface AudioFeature {
  name: string;
  value: number;
}

export interface ApiResponse {
  topArtists: Array<{
    artist: string;
    song_count: number;
    avg_streams: number;
    total_views: number;
    avg_danceability: number;
    avg_energy: number;
    avg_valence: number;
  }>;
  audioFeatures: {
    avg_danceability: number;
    avg_energy: number;
    avg_valence: number;
    avg_acousticness: number;
    avg_instrumentalness: number;
    avg_liveness: number;
    avg_speechiness: number;
  };
  platformStats: SongData[];
  genreAnalysis: Array<{
    predicted_genre: string;
    track_count: number;
    avg_streams: number;
    avg_views: number;
  }>;
  correlations: Array<{
    track: string;
    danceability: number;
    energy: number;
    valence: number;
    stream: number;
    views: number;
  }>;
}

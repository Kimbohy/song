# Music Analytics Dashboard

An interactive dashboard for visualizing and analyzing music streaming metrics across platforms.

![Music Analytics Dashboard](public/dashboard-preview.png)

## Features

- **Performance Analysis**: Track top artists, genre distribution, and streaming trends
- **Audio Features Analysis**: Visualize audio characteristics like danceability, energy, and valence
- **Platform Comparison**: Compare performance metrics between Spotify and YouTube
- **Artist Comparison**: Side-by-side comparison of up to three artists
- **Advanced Filtering**: Filter data by artist, metrics, and more
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: Tremor + Tailwind CSS
- **Charting**: Recharts
- **Animation**: Framer Motion
- **Database**: MySQL

## Dashboard Sections

### Performance Tab

Shows top artists by stream counts, genre distribution based on audio features, and streaming trends over time.

### Audio Features Tab

Displays audio features analysis with average values for danceability, energy, valence, acousticness, instrumentalness, liveness, and speechiness. Includes correlations between features and popularity.

### Platform Analysis Tab

Compares performance metrics between Spotify and YouTube, showing streams vs views scatter plot, engagement metrics, and detailed breakdown by track.

### Artist Comparison Tab (Optional)

When comparison mode is active, allows side-by-side comparison of up to three artists using radar charts, bar charts, and more.

## API Endpoints

### GET /api/stats

Returns music streaming statistics. Supports the following query parameters:

- `artist`: Filter by artist name
- `sort`: Sort by a specific audio feature or metric
- `minStreams`: Minimum stream count threshold
- `limit`: Maximum number of results to return

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your MySQL database and import data using the provided SQL script
4. Update database configuration in `lib/db.ts`
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Structure

The dashboard works with song data that includes:

- Artist, track, and album information
- Streaming metrics (Spotify streams, YouTube views/likes/comments)
- Audio features (danceability, energy, valence, etc.)
- Platform URLs

## Customization

You can customize the dashboard by:

1. Modifying the chart components in `components/charts/`
2. Adding new tabs or visualizations
3. Extending the API with additional endpoints
4. Adjusting the color scheme and styling

## License

MIT

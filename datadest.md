# 🎵 Song Dataset Documentation

## 🎧 Basic Track Information
- **Track**: Name of the song, as visible on the Spotify platform.
- **Artist**: Name of the artist.
- **Album**: The album in which the song is contained on Spotify.
- **Album_type**: Indicates if the song is released on Spotify as a single or contained in an album.

## 🔗 Spotify Links & IDs
- **Url_spotify**: The URL of the artist.
- **Uri**: A Spotify link used to find the song through the API.

## 📊 Audio Features
| Feature | Description | Range |
|---------|-------------|-------|
| **Danceability** | How suitable a track is for dancing based on tempo, rhythm stability, beat strength, and regularity. | 0.0-1.0 |
| **Energy** | Represents intensity and activity. Energetic tracks feel fast, loud, and noisy. | 0.0-1.0 |
| **Key** | The key the track is in. Integers map to pitches (0 = C, 1 = C♯/D♭, etc.). | -1 to 11 |
| **Loudness** | Overall loudness in decibels (dB). | -60 to 0 dB |
| **Speechiness** | Presence of spoken words. | 0.0-1.0 |
| **Acousticness** | Confidence measure of whether the track is acoustic. | 0.0-1.0 |
| **Instrumentalness** | Predicts whether a track contains no vocals. | 0.0-1.0 |
| **Liveness** | Detects audience presence in the recording. | 0.0-1.0 |
| **Valence** | Musical positiveness conveyed by a track. | 0.0-1.0 |
| **Tempo** | Estimated tempo in beats per minute (BPM). | BPM |
| **Duration_ms** | Duration of the track in milliseconds. | ms |

## 📈 Spotify Performance
- **Stream**: Number of streams of the song on Spotify.

## 📺 YouTube Information
- **Url_youtube**: URL of the video linked to the song on YouTube, if any.
- **Title**: Title of the videoclip on YouTube.
- **Channel**: Name of the channel that published the video.
- **Description**: Description of the video on YouTube.
- **Licensed**: Indicates whether the video represents licensed content (uploaded to a channel linked to a YouTube content partner and claimed by that partner).
- **official_video**: Boolean value indicating if the video found is the official video of the song.

## 📊 YouTube Performance
- **Views**: Number of views.
- **Likes**: Number of likes.
- **Comments**: Number of comments.
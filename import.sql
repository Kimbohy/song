-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS music_db;
USE music_db;

-- Create table
CREATE TABLE IF NOT EXISTS songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artist VARCHAR(255),
    url_spotify VARCHAR(255),
    track VARCHAR(255),
    album VARCHAR(255),
    album_type VARCHAR(50),
    uri VARCHAR(255),
    danceability FLOAT,
    energy FLOAT,
    song_key FLOAT,
    loudness FLOAT,
    speechiness FLOAT,
    acousticness FLOAT,
    instrumentalness FLOAT,
    liveness FLOAT,
    valence FLOAT,
    tempo FLOAT,
    duration_ms FLOAT,
    url_youtube VARCHAR(255),
    title VARCHAR(255),
    channel VARCHAR(255),
    views FLOAT,
    likes FLOAT,
    comments FLOAT,
    description TEXT,
    licensed BOOLEAN,
    official_video BOOLEAN,
    stream FLOAT
);

-- Load data from CSV file
LOAD DATA LOCAL INFILE 'Spotify_Youtube.csv' 
INTO TABLE songs 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(@dummy, artist, url_spotify, track, album, album_type, uri, danceability, 
 energy, song_key, loudness, speechiness, acousticness, instrumentalness, 
 liveness, valence, tempo, duration_ms, url_youtube, title, channel, 
 views, likes, comments, description, licensed, official_video, stream);

DELETE FROM songs WHERE album_type = 'spotify:track:4KK5zXPdms6SRj1uZn1cmn'
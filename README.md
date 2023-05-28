# Spotify Youtube Lookup

Find alternate versions of a track on Spotify using Youtube! Find Instrumentals, Remixes, Lyrics, or define your own category! Enter a link to a spotify track, and find results from youtube.

You can also enter a link to a Spotify playlist and select from the list of tracks (must be public).

## Getting Started

To start, clone the project to a local repository and run:

```bash
npm install
```

Create a [Youtube Data API Key](https://developers.google.com/youtube/v3/getting-started).

Create a project in the [Spotify Dashboard](https://developer.spotify.com/) to get your client ID and client Secret.

Copy the file `.env.local.example` and rename it to `.env.local`. 

```bash
VITE_YOUTUBE_KEY="Youtube Data API Key"
VITE_SPOTIFY_CLIENT_ID="Spotify Client Id"
VITE_SPOTIFY_CLIENT_SECRET="Spotify Client Secret"
VITE_SPOTIFY_CLIENT_SECRET="Spotify Client ID:Spotify Client Secret in Base64"
```

Run the project using:
```bash
npm run dev
```

## Restrictions
Youtube Data API is free to use, However there is a quota of `10,000/day` for free accounts. This application uses the following endpoints, and will be restricted to their specified quota costs

| Endpoint | Cost | Runs |
|---|---| --- |
|Search | 100  / request | Searches, Category changes, refresh |
|Channels | 1 / request | once per video |

Spotify API does not have any quota restriction that would affect this app in general purpose use.




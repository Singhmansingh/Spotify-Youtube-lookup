import './App.css'
import Spotify from './components/Spotify'
import Youtube from './components/Youtube'

import {useState} from 'react';
import { CategoryContext } from './contexts/CategoryContext';
import Categories from './components/Categories';
import { SpotifyContext } from './contexts/SearchContext';

function App() {

  const [spotifyTrack, setSpotifyTrack] = useState();
  const [categories, setCategories] = useState([]);

  
  return (
    <CategoryContext.Provider value={{categories, setCategories}}>
      <SpotifyContext.Provider value={{spotifyTrack,setSpotifyTrack}}>
        <div className="App">
          <div className='landing'>
            <header>
                  <h1>Spotify - Youtube Lookup</h1>
                  <p>Find alternate versions of a track on Spotify using Youtube! Find Instrumentals, Remixes, Lyrics, or define your own category!</p>
                  <p>Search by single tracks, or load a playlist of items to chose from.</p>
                  <p>Paste a link to a Spotify <strong>Track</strong> or Spotify <strong>Playlist</strong> to get started!</p>
                  <p>Example Track: <span className='example-link'>https://open.spotify.com/track/1Yk0cQdMLx5RzzFTYwmuld</span></p>
                  <p>Example Playlist: <span className='example-link'>https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF</span></p>
            </header>

            <Spotify />

          </div>


          {spotifyTrack ? <h2>Results for {spotifyTrack.title} from Youtube</h2> : <h2>Results from Youtube</h2>}


          <Youtube spotifyTrackData={spotifyTrack} />
        </div>
      </SpotifyContext.Provider>
    </CategoryContext.Provider>

  )
}

export default App

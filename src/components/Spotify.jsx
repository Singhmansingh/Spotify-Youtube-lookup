import  { useEffect, useState,useContext }  from 'react';
import { SpotifyContext } from '../contexts/SearchContext';
import {Buffer} from 'buffer';
import { ParseSpotifyId } from './Functions';
import { Carousel } from './Carousel';
import Categories from './Categories';

export default function Spotify(){
    const [searchedTracks, setSearchedTracks] = useState([]);
    const [keyring, setAuthKeyring] = useState();

    const [url, setUrl] = useState("");

    const { setSpotifyTrack } = useContext(SpotifyContext);

    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    useEffect(()=> {
        authorize();
    },[])

    async function authorize()
    {
        var res = await fetch(`https://accounts.spotify.com/api/token?grant_type=client_credentials`,{
            method:'post',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization':'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
        })
        .catch(e => { return false; })
        .then(d => d.json());

        if(!res) return false;

        setAuthKeyring(res);

    }

    async function getTrack(_url){
        var endpoint = "https://api.spotify.com/v1/tracks/";
        
        var spotifyId = ParseSpotifyId(_url);

        if(!spotifyId) return false;

        var res = await fetch(endpoint + spotifyId,{
            method:'get',
            headers:{
                'Authorization':'Bearer ' + keyring.access_token
            },
        })
        .catch(e => { return false; })
        .then(d => d.json());

        if(!res) return false;

        return res;
    }


    async function getPlaylistTracks(){

        var playlistId = ParseSpotifyId(url);
        if(!playlistId) return false;

        var endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        var res = await fetch(endpoint,{
            method:'get',
            headers:{
                'Authorization':'Bearer ' + keyring.access_token
            },
        })
        .catch(e => { return false; })
        .then(d => d.json());

        if(!res) return false;

        return res;
    }

    function formatTrack(_track){
        var trackObj = {
            id: _track.id,
            title: _track.name,
            thumbnail: _track.album?.images[0]?.url,
            url: "https://open.spotify.com/track/" + _track.id,
            releaseDate: _track?.album?.release_dates ?? undefined,
            artist: _track.artists[0].name,
            
        }

        return trackObj;
    }

    
    async function loadPlaylistTracks(){
        if(!keyring) await authorize();

        var playlist = await getPlaylistTracks();

        var tracks = playlist.items.map(item => formatTrack(item.track));

        console.log(tracks);

        setSearchedTracks([...tracks]);

    }


    async function loadTrack(_url=null){

        if(!keyring) await authorize();

        var _track = await getTrack(_url ?? url);

        var trackObj = formatTrack(_track);

        setSearchedTracks([trackObj]);
        
        setSpotifyTrack(trackObj);
    }

    
    async function formSubmit(event){
        event.preventDefault();

        var modeRegEx = /playlist|track/

        var res = modeRegEx.exec(url);

        if(!res) return alert("Invalid Link. Please enter a link to a public Spotify Track or Playlist.");

        var mode = res[0];

        switch(mode){
            case "track":
                loadTrack();
            break;
            case "playlist":
                loadPlaylistTracks();
            break;
            default:
                alert("That Spotify feature is not currently supported. Please enter a valid Track or Playlist Link.");
            break;
        }
    }

    return (
        <div className='spotify wrapper'>
            <form name='urlForm' id='urlForm' onSubmit={formSubmit}>
                <label>Spotify Link</label>
                <input type="text" name="furl" value={url} onChange={(e) => setUrl(e.target.value)}  placeholder='Enter spotify track or playlist link'/>
                <input type="submit" value="Search" />
            </form>
            <Categories/>

            {
            searchedTracks.length>0 ?
                <Carousel 
                section={searchedTracks.length > 1 ? "Playlist Tracks" : "Your Track"} 
                trackSet={searchedTracks} 
                cardCallback={loadTrack}
                platform='spotify'
                max={(searchedTracks?.length ?? 0) > 1 ? 5 : 1}
                /> : 
                <div className='no-spotify-results'>
                    <h3>Find a Track</h3>
                    <p>Search for a track in the form above. Results will appear here.</p>
                </div>
            }
            
        </div>
    )
}
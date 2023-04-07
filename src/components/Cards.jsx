import '../YouTube.css';
import '../Spotify.css';
import { useEffect } from 'react';
import { useState } from 'react';

const YoutubeCard = (props) => {

    const [channelIcon,setIcon] = useState("https://picsum.photos/100");

    const API_KEY = import.meta.env.VITE_YOUTUBE_KEY;


    useEffect(()=> {
        async function getChannelIcon(){
            var url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${props.track.channelId}&fields=items%2Fsnippet%2Fthumbnails&key=${API_KEY}`
            var res = await fetch(url).catch((e) => console.log(e));
            var data = await res.json();
            var icon = data.items[0].snippet.thumbnails.default.url;
            setIcon(icon);
        }
        getChannelIcon();
    },[])

    return (
        <a href={props.track.url} aria-label={props.track.title} title={props.track.title} target="_blank" className="yt-card">
            <img src={props.track.thumbnail} height="200" />
            <div className="details">
                <div className="channel">
                <img src={channelIcon} width="36"/>  
            </div>
                <div className="vid-details">
                <h4 className='vid-title'>{props.track.title}</h4>
                <p>{props.track.channel}</p>  
                </div>
            </div>
        </a>
    );
}

const SpotifyCard = (props) => {
    
    return (
    <div className="sp-container">
        <div className="sp-card" onClick={()=> props.callback(props.track.url) ?? null}>
            <img src={props.track.thumbnail} height="200" />
            <div className="details">
            <div className="track-details">
                <h4 className='track-title'>{props.track.title}</h4>
                <p>{props.track.artist}</p>  
            </div>
            </div>
        </div>
    </div>

    );
}

export {YoutubeCard, SpotifyCard}
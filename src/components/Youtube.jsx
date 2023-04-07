import  { useEffect, useState, useContext }  from 'react';
import { CategoryContext } from '../contexts/CategoryContext';
import { SpotifyContext } from '../contexts/SearchContext';
import he from 'he';
import { Carousel } from './Carousel';


 
export default function Youtube(props){
    const [videos, setVideos] = useState();
    const [loading, setLoading] = useState(false);
    const {categories} = useContext(CategoryContext);
    const {spotifyTrack} = useContext(SpotifyContext);
    const API_KEY = import.meta.env.VITE_YOUTUBE_KEY;

    useEffect(()=> {
        if(spotifyTrack) getVideos();
    },[spotifyTrack])

    useEffect(() => {
        if(spotifyTrack) refreshCategoryItems(categories[categories.length - 1]);
    },[categories])

    async function getVideos(){

        var videoList = await search();

        var sorted = sortVideos(videoList);

        setVideos(sorted);

    }

    async function search(category = '', maxResults = 30) {
        var data;

        var URL = "https://www.googleapis.com/youtube/v3/search?key="+API_KEY+"&part=snippet&type=video&maxResults="+maxResults+"&q=";
    
        var title = spotifyTrack.title;
        var creator = spotifyTrack.artist;

        URL += title + " by " + creator + " " + category;
        const res = await fetch(URL,{
            headers:{
                "Accept":"application/json"
            },
            method:'GET'
        });
        
        data = await res.json();

        if(!data.items) return null;


        var videoData = data.items.map(vid => parseVideoData(vid));

        return videoData;
    }

    function sortVideos(videoData){
        var sortedVideos = {};
        videoData.forEach(video => {

            var videoIsSorted = false;

            categories.forEach(category => {
                
                if(videoIsSorted) return;
                
                var categoryTest = new RegExp(category);

                if(categoryTest.test((video.title + video.description + video.channel).toLowerCase())){

                    if(!sortedVideos[category]) sortedVideos[category] = [];

                    //if(!sortVideos[category].find((_existingVideo) => _existingVideo.id == video.id)) 
                    sortedVideos[category].push(video);

                    videoIsSorted = true;
                }
            })

            if(!videoIsSorted) {
                if(!sortedVideos["other"]) sortedVideos.other = [];
                sortedVideos["other"].push(video);
            }
        });

        setLoading(false);

        return sortedVideos;
    }

    function parseVideoData(searchResult){
        var video = {
            title: he.decode(searchResult.snippet.title),
            id: searchResult.id.videoId,
            description: he.decode(searchResult.snippet.description),
            thumbnail: searchResult.snippet.thumbnails?.medium?.url,
            url: "https://youtu.be/" + searchResult.id.videoId,
            channel: searchResult.snippet.channelTitle,
            channelId: searchResult.snippet.channelId,
            meta:{
                publishDate: searchResult.snippet.publishedAt,
                liveBroadcastContent: searchResult.snippet.liveBroadcastContent,
                etag: searchResult.etag
            }
        }


        return video;
    }

    async function refreshCategoryItems(category){

        var res = await search(category, 8);

        var _vids = videos;
        _vids[category] = res;
        
        setVideos(_vids);

        return res;

    }

    const renderVideoSections = () => {

        if(!videos) return <div><p style={{textAlign:'center'}}>Results from youtube will appear here</p></div> ;

        var youtubeSections = categories.map((section,index) => {
            return (
                <Carousel key={index} section={section} trackSet={videos[section]} platform='youtube' refreshCallback={refreshCategoryItems}/>
            )
        })

        youtubeSections.push(<Carousel section={"other"} trackSet={videos["other"]} platform='youtube'/>)
 
        return youtubeSections;
    }

    return (
        <div className='youtube wrapper'>
            {renderVideoSections()}
        </div>
    )
 }


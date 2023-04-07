import { useEffect } from "react";
import { useState } from "react";
import { SpotifyCard, YoutubeCard } from './Cards';
import { Capitalize } from "./Functions";

import loadingIndictor from '../assets/loading.gif';

export function Carousel(props){
    
    const [page, setPage] = useState(0);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState([]);

    const [MAX_PER_PAGE,setMaxPages] = useState(props.max ?? 4);
    const [PAGES, setTotalPages] = useState(Math.ceil((cards?.length || MAX_PER_PAGE)/MAX_PER_PAGE));


    useEffect(()=>{
        setTotalPages(Math.ceil((cards?.length || MAX_PER_PAGE)/MAX_PER_PAGE));
        setLoading(false);

    },[cards]);

    useEffect(()=>{
        setMaxPages(props.max ?? 4);
        setCards(props.trackSet);
    },[props.trackSet])


    function changePage(direction) {
        if(page + direction < PAGES && page + direction >= 0)
        {
            setPage(page + direction);
        }
    }

    async function refreshCategory(){
        if(props.refreshCallback){
            setLoading(true);
            var newCards = await props.refreshCallback(props.section);
            setCards(newCards);
        }

    }

    function renderCarouselCards(){
        if((cards?.length ?? 0)>0)
        {


            var currentPage =  cards.slice(MAX_PER_PAGE*page).slice(0,MAX_PER_PAGE);
            if(cards.length  == 1){
                currentPage = cards;
            }

            var Card;

            switch(props.platform){
                case "youtube":
                    Card = YoutubeCard;
                break;
                case "spotify":
                    Card = SpotifyCard;
                break;
            }

            return (
                currentPage.map((track,index) => <Card key={props.platform + props.section + index} track={track} callback={props.cardCallback ?? null}/>)
            )
        }
        else if(!loading) {
            return (
                <div className="full-width">
                    <p>No Results. { props.refreshCallback ? "Search again?" : null}</p>
                    { props.refreshCallback ? <button className="refresh" onClick={refreshCategory}>Refresh Category</button> : null }
                </div>
            )
        }
        else {
            return (
                <div className="full-width">
                    <img src={loadingIndictor} width="200"/>
                </div>

            )
        }
    }

    return(
        <div className={'section ' + props.platform + "_section"}>
            <h3 className="carousel-title" onDoubleClick={refreshCategory}>{Capitalize(props.section)} {(cards?.length || 0) > 1 ? `(${cards.length})` : ''}</h3>
            <div className={'carousel ' + props.platform+'_carousel ' + (cards?.length == 1 ? 'single' : '')} >
                {renderCarouselCards()}
            </div>
            {
                PAGES == 1 ? null
                : 
                    <div className="pagination">

                    <span className={"paginate " + (!(page > 0) ? "maxed":null)} onClick={()=> changePage(-1)}>{"<"} Prev</span>
                    <span> {page+1} </span>
                    <span className={"paginate " + (!(page < PAGES - 1) ? "maxed":null)} onClick={()=> changePage(1)}>Next {">"}</span>

                </div>
            }
            
        </div>
    )
}
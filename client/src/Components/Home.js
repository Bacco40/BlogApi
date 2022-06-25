import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import Moment from 'moment';
import axios from "axios";
import cover from './Cover2.png';
import loading from './load.gif';
import { library } from "@fortawesome/fontawesome-svg-core";
import{faArrowRight, faArrowTrendUp} from '@fortawesome/free-solid-svg-icons';
library.add(faArrowRight, faArrowTrendUp);

function Home({logged}){
    Moment.locale('en');
    const [load,setLoad] = useState(true);
    const[publicPosts, setPublicPosts] = useState(null);
    const redirect = useNavigate();

    function start(e){
        e.preventDefault();
        if(logged === false){
            redirect('/login')
        }
        else{
            const element = document.getElementById("readPost"); 
            const y = element.getBoundingClientRect().top + window.pageYOffset + (-69);
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    }

    useEffect(()=>{
        axios.get(`/api/`)
        .then(res => {
            setPublicPosts(res.data.posts);
            setLoad(false);
        })
    },[])

    return (
        <div className="homeContent">
            <div className="cover">
                <div className="titleContainer">
                        <h2 className="pageTitle"> Stay Curious.</h2>
                        <p className="subtitle">Discover stories, thinking, and expertise from writers on any topic.</p>
                        <button className="homeBtn" onClick={(e) => start(e)}> Get Started <FontAwesomeIcon icon="fa-solid fa-arrow-right" /></button>
                </div>
                <img className="coverImg" src={cover} alt="people reading"/>
            </div>
            {load === true &&
                <div className='loadContent'>
                  <img className='loading' src={loading} alt='loading...'/>
                </div>
            }
            {publicPosts !== null && load === false &&
                <>
                    <div className='homeTitle' id="readPost">
                        <p className="trending"><FontAwesomeIcon icon="fa-solid fa-arrow-trend-up" /> &nbsp;&nbsp;Trending On Blogify : </p><hr className="hrHome"/>
                    </div>
                    <div className='allPost' >
                        {publicPosts.map((singlePost,index) =>(
                            <Link key={index} className = 'singlePost' to={`/post/${singlePost._id}`} style={{ textDecoration: 'none'}}>
                                <img className='smallPostImage' src={singlePost.image_url} alt={singlePost.title}/>
                                <div className='postBottom'>
                                    <div className='postInfo'>
                                        <p className="subtitlePost" >{singlePost.title}</p>
                                        <p className='creatorPost'>Published by {singlePost.creator.username} on {Moment(singlePost.date_of_creation).format('MMM d - YY')}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </> 
            }
       </div>
    )
}
export default Home;
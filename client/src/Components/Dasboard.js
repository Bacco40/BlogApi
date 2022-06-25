import {useNavigate, Link} from 'react-router-dom';
import React, { useEffect, useState} from 'react';
import axios from 'axios';
import Moment from 'moment';
import loading from './load.gif';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {faChartBar, faArrowRight, faPenToSquare, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {faClipboard} from '@fortawesome/free-regular-svg-icons';
library.add(faChartBar, faClipboard, faArrowRight,faPenToSquare,faTrashCan);

function Dashboard({setLogged, logged}){
    const redirect= useNavigate();
    Moment.locale('en');
    const [user, setUser] = useState(null);
    const [load,setLoad] = useState(true);
    const[publicPosts, setPublicPosts] = useState(null);
    const[privatePosts, setPrivatePosts] = useState(null);

    function editPublic(e){
        e.preventDefault();
        const pressedButton = e.target.id;
        const id = e.target.name;
        if(pressedButton === 'public'){
            const isPublic=false;
            axios.put(`/post/${id}/publish`, {isPublic})
            .then(res => {
                recovePost();
            })
        }
        else{
            const isPublic=true;
            axios.put(`/post/${id}/publish`, {isPublic})
            .then(res => {
                recovePost();
            })
        }
    }

    function removePost(e){
        e.preventDefault();
        let id=e.target.id;
        if(id === ''){
            id=e.target.viewportElement.id;
        }
        axios.delete(`/post/${id}/delete`)
            .then(res => {
                recovePost();
            })
    }

    function recovePost(){
        if(logged === true){
            const actualUser = localStorage.getItem('user');
            setUser(localStorage.getItem('username'));
            axios.get(`/user/${actualUser}`)
            .then(res => {
                const published = [];
                const unpublished= [];
                for(let i=0; i<res.data.posts.length ;i++){
                    if(res.data.posts[i].isPublished === true){
                        published.push(res.data.posts[i])
                    }else{
                        unpublished.push(res.data.posts[i])
                    }
                }
                if(published.length>0){
                    setPublicPosts(published);
                }else{
                    setPublicPosts(null)
                }
                if(unpublished.length>0){
                    setPrivatePosts(unpublished);
                }else{
                    setPrivatePosts(null)
                }
                setLoad(false);
            })
        }
    }

    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`/test`)
            .then(res => {
                setLogged(true);
            })
        } 
        else{
            redirect('/');
        }
    },[])

    useEffect(()=>{
        recovePost();
    },[logged])

    return (
       <div className="content">
        <p className="subtitleDash"> <FontAwesomeIcon className="icon" icon="fa-solid fa-chart-bar" /> {user}  Dashboard </p><hr className="hrCreate"/>
            {load === true &&
                <div className='loadContent'>
                  <img className='loading' src={loading} alt='loading...'/>
                </div>
            }
           {user !== null &&  load === false &&
           <> 
                <div className="published">
                    <p className="description">Published Post:</p>
                    {publicPosts === null &&
                        <div className='noPost'>
                                <p className="description2">No Posts Yet</p>
                                <FontAwesomeIcon className='bigIcon' icon="fa-regular fa-clipboard" />
                                <button className="homeBtn"> Add Post &nbsp;<FontAwesomeIcon icon="fa-solid fa-arrow-right" /></button>
                        </div>
                    }
                    {publicPosts !== null &&
                        <div className='allPost'>
                            {publicPosts.map((singlePost,index) =>(
                                <Link key={index} className = 'singlePost' to={`/post/${singlePost._id}`} style={{ textDecoration: 'none'}}>
                                    <div className='postTop'>
                                        <Link to={`/editPost/${singlePost._id}`} className='iconBtn'><FontAwesomeIcon icon="fa-solid fa-pen-to-square" /></Link>
                                        <button className='iconBtn' id={singlePost._id} onClick={(e) => removePost(e)}><FontAwesomeIcon icon="fa-solid fa-trash-can" id={singlePost._id}/></button>
                                    </div>
                                    <img className='smallPostImage' src={singlePost.image_url} alt={singlePost.title}/>
                                    <div className='postBottom'>
                                        <div className='postInfo'>
                                            <p className="subtitlePost" >{singlePost.title}</p>
                                            <p className='creatorPost'>Published by {singlePost.creator.username} on {Moment(singlePost.date_of_creation).format('MMM d - YY')}</p>
                                        </div>
                                        <button className='publicPost' id='public' name={singlePost._id} onClick={(e) =>editPublic(e)}>Unpublish</button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    }
                    
                </div><hr className="hrCreate"/>
                <div className="published">
                    <p className="description">Unpublished Post:</p>
                    {privatePosts === null &&
                        <div className='noPost'>
                                <p className="description2">No Posts Yet</p>
                                <FontAwesomeIcon className='bigIcon' icon="fa-regular fa-clipboard" />
                                <button className="homeBtn"> Add Post &nbsp;<FontAwesomeIcon icon="fa-solid fa-arrow-right" /></button>
                        </div>
                    }
                    {privatePosts !== null &&
                        <div className='allPost'>
                            {privatePosts.map((singlePost,index) =>(
                                <Link key={index} className = 'singlePost' to={`/post/${singlePost._id}`} style={{ textDecoration: 'none'}}>
                                    <div className='postTop'>
                                    <Link to={`/editPost/${singlePost._id}`} className='iconBtn'><FontAwesomeIcon icon="fa-solid fa-pen-to-square" /></Link>
                                        <button className='iconBtn' id={singlePost._id} onClick={(e) => removePost(e)}><FontAwesomeIcon icon="fa-solid fa-trash-can" id={singlePost._id}/></button>
                                    </div>
                                    <img className='smallPostImage' src={singlePost.image_url} alt={singlePost.title}/>
                                    <div className='postBottom'>
                                        <div className='postInfo'>
                                            <p className="subtitlePost" >{singlePost.title}</p>
                                            <p className='creatorPost'>Created by {singlePost.creator.username} on {Moment(singlePost.date_of_creation).format('MMM d - YY')}</p>
                                        </div>
                                        <button className='publicPost' id='private' name={singlePost._id} onClick={(e) =>editPublic(e)}>Publish</button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    }
                </div>
           </>
           }
       </div>
    )
}
export default Dashboard;
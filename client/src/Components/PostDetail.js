import {useNavigate, Link} from 'react-router-dom';
import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import loading from './load.gif';
import Moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';
library.add(faArrowUpRightFromSquare);

function PostDetail({setLogged, logged}){
    Moment.locale('en');
    const[post, setPost] = useState(null);
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [error,setError] = useState(null);
    const [load,setLoad] = useState(true);
    const redirect = useNavigate();

    function addComment(e){
        e.preventDefault();
        const comment = document.querySelector('#comment').value;
        axios.post(`/api/comment/${id}/create`, {comment, user})
            .then(res => {
                if(res.data === true){
                    setError(null)
                    document.querySelector('#comment').value = null;
                    recovePost();
                }
                else{
                    setError(res.data.errors);
                }
            })
    }

    function removeComment(e){
        e.preventDefault();
        let id=e.target.id;
        if(id === ''){
            id=e.target.viewportElement.id;
        }
        axios.delete(`/api/comment/${id}/delete`)
            .then(res => {
                recovePost();
        })
    }

    function removePost(e){
        e.preventDefault();
        let id=e.target.id;
        if(id === ''){
            id=e.target.viewportElement.id;
        }
        axios.delete(`/api/post/${id}/delete`)
            .then(res => {
                recovePost();
            })
    }

    function recovePost(){
        const tempUser = localStorage.getItem('user');
        axios.get(`/api/post/${id}`)
        .then(res => {
            if(res.data.post){
                if(res.data.post.isPublished === true || res.data.post.creator._id === tempUser){
                setPost(res.data.post);
                setLoad(false);
                setUser(tempUser);
                }
                else{
                    redirect('/');
                }
            }
            else{
                redirect('/');
            }
        })
    }

    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`/api/test`)
            .then(res => {
                setLogged(true);
            })
        }
    },[])

    useEffect(()=>{
        recovePost();
    },[])

    useEffect(()=>{
        if(post !== null){
            document.querySelector('.postText').innerHTML = post.post;
        }
    },[post])

    return (
       <div className="content">
            {load === true &&
                <div className='loadContent'>
                  <img className='loading' src={loading} alt='loading...'/>
                </div>
            }
            {post !== null && load === false &&
            <>
                <div className='topContent'>
                    <div>
                        <p className="subtitleDash">{post.title}</p>
                        <p className='creator'>Published by {post.creator.username} on {Moment(post.date_of_creation).format('MMM d - YY')}</p>
                    </div>
                    {user === post.creator._id &&
                        <div className='postDetailButton'>
                            <Link to={`/editPost/${post._id}`} className='iconBtn'><FontAwesomeIcon icon="fa-solid fa-pen-to-square" /></Link>
                            <button className='iconBtn' id={post._id} onClick={(e) => removePost(e)}><FontAwesomeIcon icon="fa-solid fa-trash-can" id={post._id}/></button>
                        </div>
                    }
                    
                </div><hr className='hrCreate'/>
                <div className='postContent'>
                    <img className='postImage' src={post.image_url} alt={post.title}/>
                    <div className='postText'></div>
                    <hr className='hrCreate'/>
                    {user !== null &&
                        <>
                            <form className='postComment'>
                                <input className="formInput" name="comment" id="comment" placeholder="Add a Comment ..." type="text"/>
                                <button className="buttonMenu" onClick={(e => addComment(e))}>Comment &nbsp;<FontAwesomeIcon icon="fa-solid fa-arrow-up-right-from-square" /></button>
                            </form>
                            <div className='error'>
                                {error !== null &&
                                    <ul className='ul'>
                                        {error.map((singleError,index) =>(
                                            <li className="errorForm" key={index}>{singleError.msg}</li>
                                        ))}
                                    </ul>
                                }
                            </div>
                        </>
                    }
                    {user === null &&
                        <div className='commentPost' id="comment">
                            <p>Not a member?</p> 
                            <Link className='buttonMenu' id='linkRegister' to='/signup'>
                                SignUp
                            </Link>
                            <p>To leave a comment</p> 
                        </div> 
                    }
                    <div className='allComments'>
                        {post.comments.length > 0 &&
                            <div className='commentTitle'>
                                <p>Comments: </p><hr className='hrCreate'/>
                            </div>
                        }
                        {post.comments.map((singleComment,index) =>(
                            <div key={index} className='commentContainer'>
                                <div className='postComment'>
                                    <p className='creatorComment'>{singleComment.creator.username} on {Moment(singleComment.date_of_creation).format('MMM d - YY')}</p>
                                    {singleComment.creator._id === user &&
                                        <div className='postTop'>
                                            <button className='iconBtn' id={singleComment._id} onClick={(e)=>removeComment(e)}><FontAwesomeIcon icon="fa-solid fa-trash-can" id={singleComment._id}/></button>
                                        </div>
                                    }
                                </div>
                                <p>{singleComment.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </>
            }
           
       </div>
    )
}
export default PostDetail;
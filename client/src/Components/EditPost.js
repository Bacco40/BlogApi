import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import loading from './load.gif';
import {useNavigate, useParams} from 'react-router-dom';
import React, { useRef, useState, useEffect} from 'react';

function EditPost({setLogged}){
    const editorRef = useRef(null);
    const {id} = useParams();
    const redirect=useNavigate();
    const [error,setError] = useState(null);
    const [load,setLoad] = useState(true);
    const[postEdit, setPostEdit] = useState(null);

    function savePost(e) {
        e.preventDefault();
        const title = document.querySelector('#title').value;
        const image_url = document.querySelector('#imageUrl').value;
        if (editorRef.current){
            const post = (editorRef.current.getContent());
            const isPublished = postEdit.isPublished;
            axios.put(`/api/post/${id}/update`, {title,image_url,post,isPublished})
                .then(res => {
                   if(!res.data.errors ){
                    redirect(`/post/${id}`);
                   }
                   else{
                    setError(res.data.errors);
                   }
            })
        }
    };

    function recovePost(){
        axios.get(`/api/post/${id}/update`)
        .then(res => {
            const user = localStorage.getItem('user');
            if(res.data.post){
                if(user === res.data.post.creator){
                    setPostEdit(res.data.post);
                    setLoad(false);
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
                recovePost();
                setLogged(true);
            })
        } 
        else{
            redirect('/');
        }
    },[])

    return (
    <div className="content">
        <p className="subtitleDash"> Update Post </p><hr className='hrCreate'/>
        {load === true &&
            <div className='loadContent'>
                <img className='loading' src={loading} alt='loading...'/>
            </div>
        }
        {postEdit !== null && load ===false &&
            <form className='formCreate' >
                <div className="formCreateContent">
                    <label className="formLabel" htmlFor="title">Title : *</label>
                    <input className="formInput" name="title" id="title" type="text" defaultValue={postEdit.title}/><hr className="hrCreate"/>
                    <label className="formLabel" htmlFor="imageUrl">Image Url:</label>
                    <input className="formInput" name="imageUrl" id="imageUrl" placeholder="https://google/myImage.png" defaultValue={postEdit.image_url} type="text"/><hr className="hrCreate"/>
                    <label className="formLabel" htmlFor="post">Post Content : *</label>
                    <Editor
                        apiKey='frdi8gt3qque8t7pmq7s098y7xe1o2td4sd5ige5f7vs48u8'
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue= {postEdit.post}
                        init={{
                        height: 500,
                        menubar: false,
                        skin: 'oxide-dark',
                        content_css: 'dark',
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                    <div className='error'>
                        {error !== null &&
                            <ul  className='ul'>
                                {error.map((singleError,index) =>(
                                    <li className="errorForm" key={index}>{singleError.msg}</li>
                                ))}
                            </ul>
                        }
                    </div>
                    <button className="buttonMenu" onClick={(e)=>savePost(e)}>Update Post</button>
                </div>
            </form>
        }
    </div>
    )
}
export default EditPost;
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import React, { useRef, useState, useEffect} from 'react';

function CreatePost({setLogged}){
    const editorRef = useRef(null);
    const redirect=useNavigate();
    const [error,setError] = useState(null);

    function savePost(e) {
        e.preventDefault();
        const title = document.querySelector('#title').value;
        const image_url = document.querySelector('#imageUrl').value;
        if (editorRef.current){
            const post = (editorRef.current.getContent());
            const user = localStorage.getItem('user');
            axios.post(`http://localhost:5000/post/create`, {title,image_url,post,user})
                .then(res => {
                   if(!res.data.errors ){
                    redirect(`/post/${res.data._id}`);
                   }
                   else{
                    setError(res.data.errors);
                   }
            })
        }
    };

    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('http://localhost:5000/test')
            .then(res => {
                setLogged(true);
            })
        } 
        else{
            redirect('/');
        }
    },[])

    return (
    <div className="content">
        <p className="subtitleDash"> Create Post </p><hr/>
        <form className='formCreate' >
            <div className="formCreateContent">
                <label className="formLabel" htmlFor="title">Title : *</label>
                <input className="formInput" name="title" id="title" placeholder="Post title" type="text"/><hr className="hrCreate"/>
                <label className="formLabel" htmlFor="imageUrl">Image Url:</label>
                <input className="formInput" name="imageUrl" id="imageUrl" placeholder="https://google/myImage.png" type="text"/><hr className="hrCreate"/>
                <label className="formLabel" htmlFor="post">Post Content : *</label>
                <Editor
                    apiKey='frdi8gt3qque8t7pmq7s098y7xe1o2td4sd5ige5f7vs48u8'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue="<p>Add the post content here! :)</p>"
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
                <button className="buttonMenu" onClick={(e)=>savePost(e)}>Create Post</button>
            </div>
        </form>
    </div>
    )
}
export default CreatePost;
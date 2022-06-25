import {Link,useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function Signup(){
    let redirect =useNavigate();

    function registerUser(e){
        e.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#pass').value;
        const confPassword =  document.querySelector('#confPass').value;
        axios.post(`/api/signup`, {username,password,confPassword})
            .then(res => {
                if(!res.data.errors){
                    redirect('/login')
                }else{
                    console.log(res.data.errors)
                }
         })
    }

    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token){
            redirect('/');
        } 
    },[])

    return (
        <div className="formContainer">
            <form className='form'>
                <h2 className='subtitle'> Signup </h2>
                <div className='subtitle2'>
                   <p>Already a member?</p> 
                   <Link to='/login'>
                    Login
                   </Link>
                </div> 
                <div className="formContent">
                    <label className="formLabel" htmlFor="username">Username</label>
                    <input className="formElement" name="username" id="username" placeholder="username" type="text"/>
                    <label className="formLabel" htmlFor="password">Password</label>
                    <input className="formElement" name="password" id="pass" type="password"/>
                    <label className="formLabel" htmlFor="confPassword">Confirm Password</label>
                    <input className="formElement" id="confPass" name="confPassword" type="password"/>
                    <div className='error'></div>
                    <button className="buttonMenu" onClick={(e)=>registerUser(e)}>SignUp</button>
                </div>
            </form>
        </div>
            
    )
}
export default Signup;
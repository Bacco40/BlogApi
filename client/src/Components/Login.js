import axios from 'axios';
import {Link,useNavigate} from 'react-router-dom';
import {useEffect} from 'react';

function Login({setLogged}){
    let redirect =useNavigate();

    function logUser(e){
        e.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#pass').value;
        axios.post(`http://localhost:5000/login`, {username,password})
            .then(res => {
                if(res.data.user !== false)
                {
                    const token = res.data.token;
                    setLogged(true);
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', res.data.user._id);
                    localStorage.setItem('username', res.data.user.username);
                    redirect('/');
                }
                else{
                    document.querySelector('.error').innerHTML='Incorrect username or password';
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
            <form className='form' >
                <h2 className='subtitle'> Login </h2>
                <div className='subtitle2'>
                   <p>Not a member?</p> 
                   <Link to='/signup'>
                    SignUp
                    </Link>
                </div>
                <div className="formContent">
                    <label className="formLabel" htmlFor="username">Username</label>
                    <input className="formElement" name="username" id="username" placeholder="username" type="text"/>
                    <label className="formLabel" htmlFor="password">Password</label>
                    <input className="formElement" id="pass" name="password" type="password"/>
                    <div className='error'></div>
                    <button className="buttonMenu" onClick={(e)=>logUser(e)}>Login</button>
                </div>
            </form>
        </div>
            
    )
}
export default Login;
import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Footer from './Components/Footer';
import Dashboard from './Components/Dasboard';
import CreatePost from './Components/CreatePost';
import PostDetail from './Components/PostDetail';
import EditPost from './Components/EditPost';
import { Route, Routes} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const [logged,setLogged] = useState(false);

  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(token){
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`/api/test`)
      .then(res => {
        setLogged(true);
      })
    } 
  },[logged])

  return (
    <div className="App">
      <header className="App-header">
        <Navbar logged={logged} setLogged={setLogged}/>
      </header>
      <main>
        <Routes>
          <Route path='/' element={
            <Home logged={logged}/>
          }/>
          <Route path='/login' element={
            <Login setLogged={setLogged}/>
          }/>
          <Route path='/signup' element={
            <Signup/>
          }/>
          <Route path='/dashboard' element={
            <Dashboard setLogged={setLogged} logged={logged}/>
          }/>
          <Route path='/createPost' element={
            <CreatePost setLogged={setLogged}/>
          }/>
          <Route path='/post/:id' element={
            <PostDetail setLogged={setLogged} logged={logged}/>
          }/>
          <Route path='/editPost/:id' element={
            <EditPost setLogged={setLogged} logged={logged}/>
          }/>
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;

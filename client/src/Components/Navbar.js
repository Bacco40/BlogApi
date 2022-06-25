import {Link,useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import{faWind} from '@fortawesome/free-solid-svg-icons';
library.add(faWind);

function Navbar ({logged, setLogged}){
    const redirect = useNavigate();

    function logOutUser(e){
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        setLogged(false);
        redirect('/');
    }

    return (
        <nav>
            <Link className="title" to='/'>
                <h1>Blogify <FontAwesomeIcon icon="fa-solid fa-wind" /></h1>
            </Link>
            <div className="buttonNav">
                {logged === false &&
                    <>
                        <Link className="buttonTop" to='/login'>
                            Login
                        </Link>
                        <Link className="buttonTop" to='/signup'>
                            SignUp
                        </Link>
                    </>
                }
                {logged === true && 
                    <>
                        <div className="menuBig">
                            <Link className='link' to='/'>
                                Home
                            </Link>
                            <Link className='link' to='/dashboard'>
                                Dashboard
                            </Link>
                            <Link className="buttonTop" to='/createPost'>
                                Create Post
                            </Link>
                            <button className="logOut" onClick={(e)=>logOutUser(e)}>
                                Logout
                            </button> 
                        </div>
                        <div className="menuContainer">
                            <input type="checkbox" className="toggler"/>
                            <div className="hamburger"><div></div></div>
                            <div className="menu">
                                <div>
                                    <div>
                                        <ul>
                                            <li><Link className='buttonHamb' to='/' onClick={(e) =>{document.querySelector('.toggler').checked = false}}> Home </Link></li>
                                            <li><Link className='buttonHamb' to='/dashboard' onClick={(e) =>{document.querySelector('.toggler').checked = false}}> Dashboard </Link></li>
                                            <li><Link className="buttonHamb" to='/createPost' onClick={(e) =>{document.querySelector('.toggler').checked = false}}>Create Post</Link></li>
                                            <li><button className="logOutHamb" onClick={(e)=>{document.querySelector('.toggler').checked = false; logOutUser(e)}}> Logout </button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </nav>
    )
}
export default Navbar;
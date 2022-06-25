import React,{ Component }  from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
library.add(faGithub);

class Footer extends Component {
  render(){
    return <footer className="footer">
        <a className='github' href="https://github.com/Bacco40" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon="fa-brands fa-github" />
        </a> &nbsp;
        Copyright © Matteo Bacchetti - The Odin Project 2022 </footer>
  }
}

export default Footer;
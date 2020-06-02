import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BackgroundMap } from './App';

class Header extends React.Component {
	render() {
		return(
			<div id="head" class="op80">
			<div class="text mt4" id="navbar">
				<nav class='helvetica tc pb3'>  
					<a class='link orange gray mh5' data-value="blog" href="https://blog.walterkjenkins.com">Blog</a>
					<a class='link orange dim gray f6 f5-ns dib mh5' data-value="contact" href="#contact">Contact</a>
					<a class='link orange dim gray f6 f5-ns dib mh5' data-value="portfolio"href="#portfolio">Portfolio</a>    
				</nav>
			</div>
			</div>
		)
	}
}


ReactDOM.render(
	<App />,
  document.getElementById('root')
  
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

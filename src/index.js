import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import { background_map, header } from './App';
import * as serviceWorker from './serviceWorker';
import mapboxgl from'mapbox-gl';
import * as p from 'private';
import { BackgroundMap } from './App'




  ReactDOM.render(<BackgroundMap />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

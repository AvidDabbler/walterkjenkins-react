import React from 'react';
import './App.css';
import {mbToken} from './private';
import mapboxgl from 'mapbox-gl';
import Pbf from 'pbf';
import { FeedMessage } from './gtfs-realtime.browser.proto.js';
import cors_vehicles from './cors';
// import express from 'express';
// import cors from 'cors';
// import bodyparser from 'body-parser';


// !!! NOTES !!!
// preprocessing .proto files and working with pbf -> https://gavinr.com/protocol-buffers-protobuf-browser/
// processing cors errors -> https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/



mapboxgl.accessToken = mbToken();

class BackgroundMap extends React.Component {
	// Code from the next few steps will go here
	constructor(props) {
		super(props);
		this.state = {
			lng: -90.280318,
			lat: 38.6447868,
			zoom: 10.9,
		};
		}
	
    componentDidMount() {

		let vehLocations;
		var pburl = "https://www.metrostlouis.org/RealTimeData/StlRealTimeVehicles.pb?cacheBust=" + new Date().time;


		const protobufUpdate = async () => {
			const url = cors_vehicles(pburl)
			console.log(url);
			let response = await fetch(url)
			if (response.ok) {
				// if HTTP-status is 200-299
				// get the response body (the method explained below)
				const bufferRes = await response.arrayBuffer();
				const pbf = new Pbf(new Uint8Array(bufferRes));
				const obj = FeedMessage.read(pbf);
				return obj.entity;
			} else {
				console.error("error: ", response.status);
			}
		};

		

		// start of Gavin's code for processing protocol buffer information
		const map = new mapboxgl.Map({
		container: this.mapContainer,
		style: 'mapbox://styles/walterj/ckaer3czj1a6o1iqjjp5xy5dm',
		center: [this.state.lng, this.state.lat],
		zoom: this.state.zoom
		});

		protobufUpdate()
			.then(data => {
			console.log(data)
			data.forEach(function(marker) {

				// create a HTML element for each feature
				var el = document.createElement('div');
				el.className = 'marker';

				let coord = [
					marker.vehicle.position.longitude,
					marker.vehicle.position.latitude,
				];

				console.log(coord)
			  
				// make a marker for each feature and add to the map
				// styling -> https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
				new mapboxgl.Marker(el)
					.setLngLat(coord)
					.addTo(map);
				
				console.log()
			  });
		})
	}
	
	

    render() {
		
		return (
			<div>
				<div ref={el => this.mapContainer = el} className="mapContainer" />
			</div>
      )
    }
  }


export { BackgroundMap };

import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import {mbToken} from './private';
import mapboxgl from 'mapbox-gl';
import Pbf from 'pbf';
import { FeedMessage } from './gtfs-realtime.browser.proto.js';
import cors_vehicles from './cors';


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
	
	updateDimensions() {
		let update_width  = window.innerWidth;
		let update_height = window.innerHeight;
		this.setState({ width: update_width, height: update_height });

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

		this.updateDimensions();
		window.addEventListener("resize", this.updateDimensions);

		protobufUpdate()
			.then(data => {
			data.forEach(function(marker) {

				// create a HTML element for each feature
				var el = document.createElement('div');
				el.className = 'marker';

				let coord = [
					marker.vehicle.position.longitude,
					marker.vehicle.position.latitude,
				];
			  
				// make a marker for each feature and add to the map
				// styling -> https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
				new mapboxgl.Marker(el)
					.setLngLat(coord)
					.addTo(map);

			  });
			})

	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions.bind(this));
	  }
	

    render() {
		
		return (
			<div id='map'
				ref={el => this.mapContainer = el}
				className="mapContainer"
				width={this.state.width}
				height={this.state.height}
			/>
      )
    }
}
  



export { BackgroundMap };

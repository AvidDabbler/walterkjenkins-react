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

const setWindowSize = () => {
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    document.getElementById('root').style.height = windowHeight + "px";
    document.getElementById('root').style.width = windowWidth + "px";
    console.log(document.getElementById('root').style.width);
}

mapboxgl.accessToken = mbToken();
var pburl = "https://www.metrostlouis.org/RealTimeData/StlRealTimeVehicles.pb?cacheBust=" + new Date().time;


// converts data to geojson
// mapbox example: https://docs.mapbox.com/help/data/stations.geojson
const geoData = (d) => {
	let geoJson = {};
	geoJson['type'] = 'FeatureCollection'
	geoJson['features'] = [];

	d.forEach(el => {
		let feature = {};

		feature['type'] = 'Feature';
		// reorganize geometry sections
		feature['geometry'] = {};
		feature['geometry']['type'] = 'Point';
		feature['geometry']['coordinates'] = [el.vehicle.position.longitude, el.vehicle.position.latitude,];

		// set up id in properties
		feature['properties'] = {};
		feature['properties']['id'] = el.vehicle.vehicle.id;

		geoJson['features'].push(feature);
	});

	return geoJson;
}

const protobufUpdate = async () => {
	const url = cors_vehicles(pburl);
	console.log(url);
	let response = await fetch(url)
	if (response.ok) {
		// if HTTP-status is 200-299
		// get the response body (the method explained below)
		const bufferRes = await response.arrayBuffer();
		const pbf = new Pbf(new Uint8Array(bufferRes));
		const obj = FeedMessage.read(pbf);
		return geoData(obj.entity);
	} else {
		console.error("error: ", response.status);
	}
};



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
				this.setState({mapData: data}, () => console.log(this.state))
				return data;
				// make a marker for each feature and add to the map
				// styling -> https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
				
			}).then(geoJson => {
				// geoJson.map(md => {
				// 	let coord = [
				// 		md.vehicle.position.longitude,
				// 		md.vehicle.position.latitude,
				// 	]
				// 	let mark = new mapboxgl.Marker(document.getElementById('mapContainer'))
				// 		.setLngLat(coord)
				// 		.addTo(map);
				// 	mark.options.color('#28801c')
				
				map.on('load', () => {
					map.addSource('points', {
						'type': 'geojson',
						'data': geoJson,
					})
					map.addLayer({
						'id': 'points',
						'type': 'circle',
						'source': 'points',

					});
					
				})
				// })

			})

	}

	thingThatHasATimeout() {
		console.log('thing');
	}

    render() {
		// setWindowSize();
		// window.addEventListener("resize",setWindowSize,false);
		this.thingThatHasATimeout();

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

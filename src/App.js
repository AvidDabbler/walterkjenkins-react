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

// // todo: set up interval to refetch
	// // todo: have to set up add every 15 seconds
// todo: add in header
// todo: figure out how to pan and zoom on click
// todo: disable pan and zoom

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



class BackgroundMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lng: -90.280318,
			lat: 38.6447868,
			zoom: 10.9,
			map: []
		};

		}
		// activeTime: string id associated with the active vehicle layer
		// newTime: string id associated with the data that is being processed
		// mapData: array of geoJson objects that hold the vehicle location data
	
	// initialize the map
	componentDidMount() {
		const mapOptions = {
			container: this.mapContainer,
			style: 'mapbox://styles/walterj/ckaer3czj1a6o1iqjjp5xy5dm',
			center: [this.state.lng, this.state.lat],
			zoom: this.state.zoom
		}
		this.map =	new mapboxgl.Map(mapOptions);
		this.getAndLoad();
		


	};

	
		
	// start of helper functions
	getData = async () => {
		const url = cors_vehicles(pburl);
		let response = await fetch(url)
		if (response.ok) {
			// if HTTP-status is 200-299
			// get the response body (the method explained below)
			const bufferRes = await response.arrayBuffer();
			const pbf = new Pbf(new Uint8Array(bufferRes));
			const obj = FeedMessage.read(pbf);
			console.log(obj.entity)
			return geoData(obj.entity);
		} else {
			console.error("error: ", response.status);
		}
	};

	addSource = (geoJson) => {
		const map = this.map;
		console.log(this.state);
		map.addSource(`vehicles`, {
			'type': 'geojson',
			'data': geoJson,
		})
	}

	addLayer = () => {
		const map = this.map;
		map.addLayer({
			'id': 'vehicles',
			'type': 'circle',
			'source': 'vehicles',
			
		});
	}
	// end of helper functions
	
	
	// start of builder functions
	loadData = async (geoJson) => {
		// if it is the first time the page is loaded
		this.addSource(geoJson);
		this.addLayer();
	};

	// ! this function should be run on an interval
	getAndLoad = async () => {
		this.getData()
			.then(geoJson => {
				this.loadData(geoJson);
			}).then(data => {
				setInterval(() => this.updateData(), 15000)
			})
	};

	updateData = () => {
		const map = this.map;
		this.getData().then(data => {
			map.getSource('vehicles').setData(data)
		})
	}
	// end of builder functions

    render() {

		return (
			<div id='map'
				ref={el => this.mapContainer = el}
				className="mapContainer"
				width={this.state.width}
				height={this.state.height}
			/>
      )
	};
};
  

class Head extends React.Component {
	render() {
		return (
			<div id='head'>
			
			</div>)
	}
};

export { BackgroundMap };

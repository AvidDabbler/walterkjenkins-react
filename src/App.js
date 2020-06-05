import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import {mbToken} from './private';
import mapboxgl from 'mapbox-gl';
import Pbf from 'pbf';
import { FeedMessage } from './gtfs-realtime.browser.proto.js';
import {cors} from './cors';
import githubData from './github';


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
			style: 'mapbox://styles/walterj/ckb1lvnmk06y11ilx1sf3uctj',
			center: [this.state.lng, this.state.lat],
			zoom: this.state.zoom
		}
		this.map = new mapboxgl.Map(mapOptions);
		this.getAndLoad();	
		githubData();

	};
	
	// start of helper functions
	getData = async () => {
		const url = cors(pburl);
		let response = await fetch(url)
		if (response.ok) {
			// if HTTP-status is 200-299
			// get the response body (the method explained below)
			const bufferRes = await response.arrayBuffer();
			const pbf = new Pbf(new Uint8Array(bufferRes));
			const obj = FeedMessage.read(pbf);
			console.log(new Date())
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
			'paint': {
				'circle-color': '#f06543',
				'circle-radius': 2.8

			}
		});
	}
	// end of helper functions
	
	
	// start of builder functions
	loadData = (geoJson) => {
		// if it is the first time the page is loaded
		this.addSource(geoJson);
		this.addLayer();
	};

	// ! this function should be run on an interval
	
	updateData = () => {
		const map = this.map;
		this.getData().then(data => {
			map.getSource('vehicles').setData(data)
		})
	}
	
	getAndLoad = () => {
		this.getData()
			.then(geoJson => {
				this.loadData(geoJson);
			}).then(data => {
				setInterval(() => this.updateData(), 5000)
			})
	};
	// end of builder functions

    render() {

		return (
			<div id='map'
			ref={el => this.mapContainer = el}
			className="mapContainer h80 w-100"
			width={this.state.width}
			height={this.state.height}>
			</div>
      )
	};
};

class Header extends React.Component {
	render() {
		return(
			<div id="head" class="op80 w-100 zi100 inlineext pa0 inline w-100 pv2 v-mid">
				<div id="title" className="relative ht pa0 fl"><h1>Walter Jenkins</h1></div>

					<nav class='helvetica pv3 ph2 tc fr ph3'>  
						<a class='link orange gray mh3 f6' data-value="blog" href="https://blog.walterkjenkins.com">Blog</a>
						<a class='link orange gray mh3 f6' data-value="contact" href="#contact">Contact</a>
						<a class='link orange gray mh3 f6' data-value="portfolio"href="#portfolio">Portfolio</a>    
					</nav>
			</div>
		)
	}
};
  
class HeroMenu extends React.Component {
	element = (item) => (
		<div id='{item}'>
			<img id='{item}Icon' class='flex center' src='assets/{item}.svg' alt='{item}'></img>
		</div>
	);

	list = ['data', 'maps', 'tools'];

	render() {

		return (
			<div id='hero-menu' class='w-70 center flex'>

				{/* <div id='data' class='w-30 center flex bg-blue'>
					<img id='dataIcon' class='flex center' src='assets/data.svg' alt='data'></img>
				</div>
				<div id='maps' class='w-30 center flex'>
					<img id='mapsIcon' class='flex center'  src='assets/maps.svg' alt='maps'></img>
				</div>
				<div id='tools' class='w-30 center flex'>
					<img id='toolsIcon' class='flex center'  src='./assets/tools.svg' alt='tools'></img>
				</div> */}
			</div>
		)
	}
}

const App = () => (
		<div id="app" className="w-100">
			<div className=" w-100 zi100">
				<Header className="h60 w-100" />
			</div>
			<div id="map" className="mapContainer w-100">
			<BackgroundMap className="mapContainer w-100"></BackgroundMap>
			</div>
				{/* <HeroMenu /> */}
		</div>)

export default App;

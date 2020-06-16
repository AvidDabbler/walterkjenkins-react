// react
import React, { Component, Fragment } from 'react';

// css
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

// npm
import mapboxgl from 'mapbox-gl';
import Pbf from 'pbf';

// data
import { githubData } from './data';
import { FeedMessage } from './gtfs-realtime.browser.proto.js';

// private
import { mbToken, mapStyle } from './private';
import { cors } from './cors';

// images
import  DataLogo, { ReactComponent } from './assets/data.svg';
import  MapLogo from './assets/map.svg';
import ProcessingLogo from './assets/tools.svg';

// components
import Articles from './Articles';




// !!! NOTES !!!
// preprocessing .proto files and working with pbf -> https://gavinr.com/protocol-buffers-protobuf-browser/
// processing cors errors -> https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
// import and load svg's -> https://blog.logrocket.com/how-to-use-svgs-in-react/

// NAV
// // todo: add in header

// MAP
// // todo: set up interval to refetch
	// // todo: have to set up add every 15 seconds
// // todo: figure out how to pan and zoom on click
// // todo: disable pan and zoom

// BLOG
// // todo: get blog data to fetch
// todo: get services to look correct on resize
// todo: render 3 newest articles

// PROJECTS
// todo: pick out 3 projects to highlight
// todo: put together a dictionary of all of the projects that you what to show

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



class BackgroundMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lng: -90.280318,
			lat: 38.6447868,
			zoom: 10.9,
			map: []
		};

		}
		
	// initialize the map
	componentDidMount() {
		const mapOptions = {
			container: this.mapContainer,
			style: mapStyle(),
			center: [this.state.lng, this.state.lat],
			zoom: this.state.zoom,
			interactive: false,
		}
		this.map = new mapboxgl.Map(mapOptions);
		this.getAndLoad();	
		// githubData();

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
			return geoData(obj.entity);
		} else {
			console.error("error: ", response.status);
		}
	};

	addSource = (geoJson) => {
		const map = this.map;
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
	};
	
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

class Header extends Component {
	render() {
		return(
			<div id="head" class="op80 w-100 zi100 pa0 inline w-100 pv2 v-mid">
				<nav class='pv3 ph2 tc fr ph3'>  
					<a class='link mh3 f6' data-value="services"href="#services">Services</a>    
					{/* <a class='link mh3 f6' data-value="portfolio"href="#portfolio">Portfolio</a>     */}
					<a class='link mh3 f6' data-value="projects"href="#projects">Projects</a>    
					<a class='link mh3 f6' data-value="blog" href="#blog">Blog</a>
					<a class='link mh3 f6' data-value="contact" href="#contact">Contact</a>
				</nav>
			</div>
		)
	}
};
  
class Signature extends Component {
	render() {
		return (
			<div id='hero-menu' class='w-90 v-mid center zi100 inline signature pa3 fl h6'>
				<h1 className='f-headline'>Walter Jenkins</h1>
				<h2 className='f1'>Maps+Data+Processing</h2>
			</div>
		)
	}
}

const ser = [
	{
		name: 'Maps',
		icon: MapLogo,
		desc: '',
		credit: 'GPS by Turkkub from the Noun Project',
		projectList: [],

	},
	{
		name: 'Data',
		icon: DataLogo,
		desc: '',
		credit: 'Data by OliM from the Noun Project',
		projectList: [],

	},
	{
		name: 'Processing',
		icon: ProcessingLogo,
		desc: '',
		credit: 'tools by Luboš Volkov from the Noun Project',
		projectList: [],

	},
];


// ! CONVERT TO CLASS
const RenderSect = () => {
	const list = [];
	// if page width is > 1000? 
	ser.forEach((a) =>{
		list.push(
			// issue with icon div height and width
				<a key={a.name} id={a.name} className='services service-div blue-div br3  center v-mid'>
					<img src={a.icon} alt={a.name} data-credit={a.credit} className='flex icon pa4 center v-mid inline'></img>
				</a>)}
	)
	return list
};


const App = () => (
	<div id="app" className="w-100">

		<div className=" w-100 zi100">
			<Header className="h60 w-100" />
		</div>
		
		<div id="map" className="mapContainer w-100">
			<BackgroundMap className="mapContainer w-100" />
		</div>
		
		<Signature />
		
		<div id="services" className="blue-div br3 pa4 flex w-80 flex-row space-around center v-mid h6 justify-around mb4">
			<RenderSect />
		</div>

		<div id='blog' className="center blue-div br3 pa4 flex w-80 flex-row space-around center v-mid h6 justify-around mb4">
			<Articles />
		</div>

	</div>
)

export default App;

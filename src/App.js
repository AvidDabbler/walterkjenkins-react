import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import {mbToken} from './private';
import mapboxgl from 'mapbox-gl';
import Pbf from 'pbf';
import { FeedMessage } from './gtfs-realtime.browser.proto.js';
import {cors} from './cors';
import githubData from './github';

// images
// import { ReactComponent as Walter } from './assets/walterjenkins2.svg';
// import { ReactComponent as Subhead } from './assets/mapsdataprocessing2.svg'
import  DataLogo from './assets/data.svg';




// !!! NOTES !!!
// preprocessing .proto files and working with pbf -> https://gavinr.com/protocol-buffers-protobuf-browser/
// processing cors errors -> https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
// import and load svg's -> https://blog.logrocket.com/how-to-use-svgs-in-react/

// // todo: set up interval to refetch
	// // todo: have to set up add every 15 seconds
// // todo: add in header
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
		
	// initialize the map
	componentDidMount() {
		const mapOptions = {
			container: this.mapContainer,
			style: 'mapbox://styles/walterj/ckb1lvnmk06y11ilx1sf3uctj',
			center: [this.state.lng, this.state.lat],
			zoom: this.state.zoom,
			interactive: false,
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
				{this.props.children}
			</div>
      )
	};
};

class Header extends React.Component {
	render() {
		return(
			<div id="head" class="op80 w-100 zi100 inlineext pa0 inline w-100 pv2 v-mid">
				<nav class='helvetica pv3 ph2 tc fr ph3'>  
					<a class='link orange gray mh3 f6' data-value="services"href="#services">Services</a>    
					<a class='link orange gray mh3 f6' data-value="portfolio"href="#portfolio">Portfolio</a>    
					<a class='link orange gray mh3 f6' data-value="blog" href="#blog">Blog</a>
					<a class='link orange gray mh3 f6' data-value="contact" href="#contact">Contact</a>
				</nav>
			</div>
		)
	}
};
  
class Signature extends React.Component {
	render() {
		return (
			<div id='hero-menu' class='w-90 relative  zi100 signature pa0 fl'>
				<h1>Walter Jenkins</h1>
				<h2>Maps+Data+Processing</h2>
			</div>
		)
	}
}

const ser = [
	{
		name: 'Maps',
		icon: `./assets/maps.svg`,
		desc: '',
		projectList: [],

	},
	{
		name: 'Data',
		icon: DataLogo,
		desc: '',
		projectList: [],

	},
	{
		name: 'Processing',
		icon: `assets/processing.svg`,
		desc: '',
		projectList: [],

	},
];

const list = [];
const RenderSect = () => {
	ser.forEach((a) =>{
		list.push(
			<div id={a.name}>
				<img src={a.icon} alt={a.name} icon></img>
				<h2>{a.name}</h2>
			</div>)}
	)
	return list
};

// const Services = () => (
// 		{ser.forEach((a) =>
// 				(
// 					<div id={a.name}>
// 						<img src={a.icon} alt={a.name}></img>
// 						<h2>{a.name}</h2>
// 					</div>))
// 		}
// 	);


	// createTable = () => {
	// 	let table = []
	
	// 	// Outer loop to create parent
	// 	for (let i = 0; i < 3; i++) {
	// 	  let children = []
	// 	  //Inner loop to create children
	// 	  for (let j = 0; j < 5; j++) {
	// 		children.push(<td>{`Column ${j + 1}`}</td>)
	// 	  }
	// 	  //Create the parent and add the children
	// 	  table.push(<tr>{children}</tr>)
	// 	}
	// 	return table
	//   }

	// render() {
	// 	console.log(this.renderSect())
	// 	return (
	// 		<div id="services4" class="w-100 flex">
	// 			{this.renderSect}
	// 		</div>
	// 	)
	// }


const App = () => (
		<div id="app" className="w-100">
			<div className=" w-100 zi100">
				<Header className="h60 w-100" />
			</div>
			<div id="map" className="mapContainer w-100">
				<BackgroundMap className="mapContainer w-100">
					<Signature />
				</BackgroundMap>
			</div>
			<RenderSect />
		</div>)

export default App;

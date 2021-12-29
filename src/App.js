// react
import React, { Component } from 'react';

// css
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

// npm
import mapboxgl from 'mapbox-gl';
import Pbf from 'pbf';

// data
import { FeedMessage } from './gtfs-realtime.browser.proto.js';

// private
import { mbToken, mapStyle } from './private';
import { cors } from './cors';

// images
import  DataLogo from './assets/data.svg';
import  MapLogo from './assets/map.svg';
import ProcessingLogo from './assets/tools.svg';
import Github from './assets/github.svg';
import Email from './assets/email2.svg';
import Linkedin from './assets/linkedin2.svg';

// components
import Articles from './Articles';
import Projects from './Projects';

// !!! NOTES !!!
// preprocessing .proto files and working with pbf -> https://gavinr.com/protocol-buffers-protobuf-browser/
// processing cors errors -> https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
// import and load svg's -> https://blog.logrocket.com/how-to-use-svgs-in-react/

// BLOG
// // todo: get blog data to fetch
// todo: get services to look correct on resize
// todo: render 3 newest articles

// PROJECTS
// // todo: pick out 3 projects to highlight
// // todo: put together a dictionary of all of the projects that you what to show

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
			loaded: false,
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
			<div id="head" className="op80 w-100 zi100 pa0 inline w-100 pv2 v-mid">
				<nav className='pv3 ph2 tc fr ph3'>  
					<a className='link mh3 f6' data-value="services"href="#services">Services</a>    
					<a className='link mh3 f6' data-value="blog" href="#blog">Blog</a>
					<a className='link mh3 f6' data-value="projects"href="#projects">Projects</a>    
					<a className='link mh3 f6' data-value="contact" href="#contact">Contact</a>
				</nav>
			</div>
		)
	}
};
  
class Signature extends Component {
	render() {
		return (
			<div id='hero-menu' className='w-90 v-mid center zi100 inline signature pa3 fl h6'>
				<h1 className='f-headline'>Walter Jenkins</h1>
				<h2 className='f1 w-80'>Maps+Data+Processing</h2>
			</div>
		)
	}
}

const ser = [
	{
		name: 'Maps',
		icon: MapLogo,
		desc: 'Designing stunning mapping applications and visualizations.',
		credit: 'GPS by Turkkub from the Noun Project',
		projectList: [],

	},
	{
		name: 'Data',
		icon: DataLogo,
		desc: 'Architecting sustainable logical data structures for sensible applications.',
		credit: 'Data by OliM from the Noun Project',
		projectList: [],

	},
	{
		name: 'Processing',
		icon: ProcessingLogo,
		desc: 'A track record of turning chaos into calm by standardizing workflows and processes.',
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
			<div className='center tc white blue-div br3 flex flex-column  w-100 w-60-m w-30-l pa2 mv3'>
				<img src={a.icon} alt={a.name} data-credit={a.credit} className='center section-title flex icon pa3 center v-mid inline w-40'></img>
				<h2 className='center tc pa0 ma0 section-title white'>{a.name}</h2>
				<p className='center tc mv3 helvetica white'>{a.desc}</p>
			</div>
		)
	}
	)
	return list
};

const Contact = () => {
	return (
		<div id='contact_div' className="w-80 center justify-around">
			<a href="mailto:walter.k.jenkins@gmail.com"  className="icon flex w-20" >
				<img src={Email}></img>
			</a>
			<a href="git.walterkjenkins.com"  className="icon flex w-20" >
				<img src={Github}></img>
			</a>
			<a href="linkedin.walterkjenkins.com"  className="icon flex w-20" >
				<img src={Linkedin}></img>
			</a>
		</div>)
}


const App = () => (
	<div id="app" className="w-100">

		<div className=" w-100 zi100">
			<Header className="h60 w-100" />
		</div>
		
		<div id="map" className="mapContainer w-100">
			<BackgroundMap className="mapContainer w-100" />
		</div>
		
		<Signature />
		
		<div id="services" className="center blue-div br3 pa4 flex w-80 w-70-m flex-row center v-mid h6 justify-around mb4">
			<RenderSect />
		</div>

		<div id='blog' className="center blue-div br3 pa4 flex w-80 w-70-m flex-row center v-mid h6 justify-around mb4">
			<Articles />
		</div>

		<div id='projects' className="center blue-div br3 pa4 flex w-80 w-70-m flex-row center v-mid h6 justify-around mb4">
			<Projects />
		</div>

		<div id='contact' className="center blue-div br3 pa4 flex w-80 w-70-m flex-row center v-mid h6 justify-around mb4">
			<Contact />
		</div>

	</div>
)

export default App;

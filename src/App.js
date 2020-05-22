import React from 'react';
import './App.css';
import {mbToken} from './private';
import mapboxgl from 'mapbox-gl';
import Pbf from 'pbf';
import {FeedMessage} from './gtfs-realtime.browser.proto.js';



mapboxgl.accessToken = mbToken();

class BackgroundMap extends React.Component {
  // Code from the next few steps will go here
  constructor(props) {
    super(props);
    this.state = {
    lng: -90.304,
    lat: 38.674,
    zoom: 10.9,
    };
	}
	
    componentDidMount() {

		// https://grffe.com/proxy/proxy.php?
		var pburl = "https://www.metrostlouis.org/RealTimeData/StlRealTimeVehicles.pb?cacheBust=";
		let vehLocations;

		// start of Gavin's code for processing protocol buffer information
		const protobufUpdate = async () => {
			const url = pburl +
				new Date().getTime();
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
		// end of Gavin's code
		protobufUpdate()
		.then(data => {
				console.log(data);
			}
		)


		const map = new mapboxgl.Map({
		container: this.mapContainer,
		style: 'mapbox://styles/walterj/ckaer3czj1a6o1iqjjp5xy5dm',
		center: [this.state.lng, this.state.lat],
		zoom: this.state.zoom
		});
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

import React, { Component } from 'react';
import { updatedRepos } from './data';
import { mapStyle } from './private';
import { cors_noDate } from './cors';
import repos from './repos.json';
import PY from './assets/python.svg';
import JS from './assets/javascript.svg';


class Projects extends Component {
    constructor(props) {
		super(props);
		this.state = { 
            projectData: [
                {
                  "name": "BusStopAssessmentApp",
                  "publicName": "Bus Stop Assessment App",
                  "language": JS,
                  "tags": [
                    "GIS",
                    "ESRI",
                    "Mobile",
                    "Data Collection"
                  ],
                  "desc": "A mobile friendly application used to",
                  "front": true
                },
                {
                  "name": "MetroSTL-Esri-ETL",
                  "publicName": "Metro St Louis Esri ETL",
                  "language": PY,
                  "tags": [
                    "GIS",
                    "ESRI",
                    "ETL"
                  ],
                  "sections": ["data", "workflows", "management", "infrustructure"],
                  "desc": "A mobile friendly application used to",
                  "front": true
              
                },
                {
                  "name": "GTFSRT-Parsing",
                  "publicName": "Realtime Bus Processing",
                  "language": PY,
                  "tags": [
                    "GPS",
                    "Protocol Buffer",
                    "MapBox",
                    "Leaflet"
                  ],
                  "sections": ["applications", "data", "workflows", "collect"],
                  "desc": "A mobile friendly application used to",
                  "front": true
              
                }
              ]
                          
		 };
	}

    // async componentDidMount() {
    // }

    tags(tags) {
        return tags.map(tag => (
            <div className="white mh1 dib fl helvetica">
                <p className="dib f7 br-pill ph3 pv1 mb2 dib white bg-orange">{tag}</p>
            </div>))
};

    renderProjects() {  
        let data = this.state.projectData;
        let filtered = data.filter(el => el.front == true);
        return filtered.map(el => (
            <div id={el.name} className="w-100">
                <div className="white helvetica tl flex flex-column">
                    <div className='w-60 flex flex-column'>
                        <h3>{el.publicName}</h3>
                        <p>{el.desc}</p>
                    </div>
                </div>
                <div className='w-40 flex'>
                    <img src={el.language}></img>
                </div>
                <div className="  flex flex-row w-80">
                    {this.tags(el.tags)}
                </div>
            </div>
        ))
    }

    render() {
        const { loading, projectData } = this.state;
        console.log(this.state);
        return (
            <div className='tc section-title w-90'>
                <h2 className='center tc section-title mt0'>Projects</h2>
                <div id='projects-list' className="">
                    {loading ? <h2>Still loading</h2> : this.renderProjects()}
                </div>
            </div>)
    }
}

export default Projects;
import React from 'react';
import './App.css';
import {mbToken} from './private';
import mapboxgl from 'mapbox-gl';
import {cors_noDate, cors} from './cors';

let repos = [
    {
        name: 'BusStopAssessmentApp',
        publicName: 'Bus Stop Assessment App',
        language: 'JavaScript',
        tags: ['gis', 'esri', 'project management', 'survey', 'asset management', 'javascript'],
        sections: ['data', 'mapping', 'applications', 'management'],
    }, {
        name: 'MetroSTL-Esri-ETL',
        publicName: 'Metro St Louis Esri ETL',
        language: 'Python',
        tags: ['esri', 'gis', 'arcgis online', 'python'],
        sections: ['data', 'workflows', 'management', 'infrustructure'],
    }, {
        name: 'GTFSRT-Parsing',
        publicName: 'Realtime Bus Processing',
        language: 'Python',
        tags: ['realtime', 'protocol buffer', 'gps', 'transit', 'pb', 'gis', 'mapbox', 'leaflet'],
        sections: ['applications', 'data', 'workflows', 'collect'],
    }
]

const githubData = async () => {
    const repoData = async (repo) => {
        const base = 'https://api.github.com/repos/AvidDabbler'
        const full = base + '/' + repo;
        const commits = full + '/' + 'commits'
        const fetchedData = async (url) => {
            fetch(url)
                .then(response => response.json())
                .then(data => console.log(data));
        };
        fetchedData(full);
        fetchedData(commits);
    }
    repos.forEach(element => {
        repoData(element.name);
    });
};

export default githubData;
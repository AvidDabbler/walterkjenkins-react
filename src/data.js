import './App.css';
import { cors_noDate, cors } from './cors';
import Parser from 'rss-parser';
import repos from './repos.json';

const fetchedData = async (url) => {
    let response = await fetch(url)
    let data = await response.json()
    return data;
};

const githubData = async (repo, list) => {
    const base = cors_noDate('https://api.github.com/repos/AvidDabbler');
    const full = base + '/' + repo.name;
    const commits = full + '/' + 'commits';
    // add full repo info to repos.json using above function
    // add commits info to repos.json using above function
    repo['commits'] = await fetchedData(commits);
    repo['full'] = await fetchedData(full);
    return repo;
};

let updatedRepos = async () => {
    let list = [];
    repos.forEach(async (el) => {
        list.push(await githubData(el))
    });
    return await list;
};


const rss_url = 'https://raw.githubusercontent.com/AvidDabbler/blog/master/rss.xml';


const blog = async () => {
    const parser = new Parser();
    let feed = await parser.parseURL(cors_noDate(rss_url));
    let list = []
    for (let i = 0; i < 3; i++) {
        list.push(feed.items[i]);
    }
    return list;
};

export { githubData, blog, updatedRepos };
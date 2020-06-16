import React, { Component } from 'react';
import { blog } from './data';


class Articles extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			loading: true,
		 };
	}

	async componentDidMount() 	{	
		this.storeBlog();
	};

	storeBlog = async() => {
		const blogArray = [];
		await blog().then(res => res.map(el => blogArray.push(el)));
		this.setState({ blogData: blogArray, loading: false });
	}

	date(d) {
		const fullDate = new Date(d);
		let year = fullDate.getFullYear();
		let month = (1 + fullDate.getMonth()).toString().padStart(2, '0');
		let day = fullDate.getDate().toString().padStart(2, '0');

		return month + '/' + day + '/' + year;
	}


	newestArticles(data) {
		return data.map(el => (
			<div className="" key={el.pubDate}>
				<a className="white no-underline" href={el.link}>
					<h3>{el.title}</h3>
					<h4>{this.date(el.pubDate)}</h4>
					<p>{el.contentSnippet}</p>
					<p className='i underline-hover'>Continue reading...</p>
						
				</a>
					</div>
		))
	}
	
	
	render() {
		console.log(this.state);
		const { loading, blogData } = this.state;
		return (
			<div id="idk">
				<h2 className="flex center tc section-title">Blog</h2>
				<div id='articles' className="">
					{/* {loading ? `Classic loading placeholder. this.state.loading: ${blogData}` : this.newestArticles(blogData)} */}
					{loading ? console.log("it is loading") : this.newestArticles(blogData)}
				</div>
			</div>)
	}
};

export default  Articles;
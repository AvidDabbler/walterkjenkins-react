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
			<div className="white" key={el.pubDate}>
				<h3>{el.title}</h3>
				<h4>{this.date(el.pubDate)}</h4>
				<p>{el.contentSnippet}</p>
				<a className="white no-underline" href={el.link}>
					<p className='i underline-hover'>Continue reading...</p>
				</a>
			</div>
		))
	}
	
	render() {
		const { loading, blogData } = this.state;
		return (
			<div id="idk">
				<a href='https://blog.walterkjenkins.com'>
					<h2 className="center tc section-title">Blog</h2>
				</a>

				<div id='articles' className="">
					{/* {loading ? `Classic loading placeholder. this.state.loading: ${blogData}` : this.newestArticles(blogData)} */}
					{loading ? console.log("it is loading") : this.newestArticles(blogData)}
				</div>

				<a href="https://blog.walterkjenkins.com">
					<p className="white center tc no-underline underline-hover">Continue to blog...</p>
				</a>
				
			</div>)
	}
};

export default  Articles;
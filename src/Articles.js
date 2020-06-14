import React, { Component } from 'react';
import { blog } from './data';


class Articles extends Component {
	constructor(props) {
		super(props);
		this.state = { loading: true };
	}

	async componentDidMount() {	
		if (this.state.loading) {
			this.setState({
				blogData: await blog(),
				loading: false,
			})
        }
		else {
			console.log(this.state)
		}
	};

	newestArticles = async (data) => {
		return data.map(el => (
			<div className="">
					<a className="" >
						<h3>{el.title}</h3>
						<h4>{el.pubDate}</h4>
						<p>{el.contentSnippet}</p>
					</a>
				</div>
			)
		)
	}
	
	render() {
		const { loading, blogData } = this.state;
		return (
			<div id="idk">
				<h2 className="flex center section-title">Blog</h2>
				<div id='articles' className="">
					{loading ? `Classic loading placeholder. this.state.loading: ${blogData}` : this.newestArticles(blogData)}
				</div>
			</div>)
	}
};

export default  Articles;
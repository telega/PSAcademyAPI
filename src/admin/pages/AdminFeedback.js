import React from 'react';
import PropTypes from 'prop-types';
import NavBar from '../components/NavBar';
//import AcademyButton from '../components/AcademyButton';
import BreadCrumbs from '../components/BreadCrumbs';
import FeedbackTable from '../components/FeedbackTable';
import axios from 'axios';

export default class AdminFeedback extends React.Component{

	constructor(props){
		super(props);

		this.state={
			feedbackItems:[]
		};
	}

	updateFeedbackList(){
		axios.get('/api/feedback')
			.then((response)=>{
				let feedbackItems = response.data.map((f) => {
					return {
						title:f.title,
						votes: f.userVotes.length,
						description : f.description,
						publisheds: f.published,
					};
				});
				this.setState({
					feedbackItems: feedbackItems
				});
			})
			.catch((err)=>{
				console.log(err);
			});
	}

	componentDidMount(){
		this.updateFeedbackList();
	}

	render(){
		return (
			<div>
				<NavBar activeNavItem={this.props.activeNavItem} />
				<BreadCrumbs breadCrumbs ={this.props.breadCrumbs} />
				<div className="container">
					<div className = "row">
						<div className = "col-md-12">
							<h1><span className="fa fa-comment" aria-hidden="true"> </span> Admin Feedback</h1>
							<hr/>
							<div>
							</div>

							<div className = "row">
								<div className="col-md-12">
									<h2>Feedback </h2>
								</div>
							</div>

							<FeedbackTable feedbackItems = {this.state.feedbackItems}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

AdminFeedback.propTypes = {
	activeNavItem: PropTypes.string,
	breadCrumbs: PropTypes.array
};
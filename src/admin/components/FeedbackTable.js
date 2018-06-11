import React from 'react';
import PropTypes from 'prop-types';
//import EditCourseButton from './EditCourseButton';
//import DeleteCourseButton from './DeleteCourseButton';
//import axios from 'axios';
//import AddCourseModal from './AddCourseModal'

// needs update(unpublish) and delete

class TableRow extends React.Component{

	render(){
		return(
			<tr>
				<td>{this.props.title}</td>
				<td>{this.props.votes}</td>
				<td>{this.props.description}</td>
				<td>{this.props.published ? 'Published': 'Unpublished'}</td>
			</tr>
		);
	}
}

TableRow.propTypes = {
	title: PropTypes.string,
	votes: PropTypes.number,
	description: PropTypes.string,
	published: PropTypes.bool,
};

export default class FeedbackTable extends React.Component{

	constructor(props) {
		super(props);
	
		this.state = {
			courses:[],
		};
	}

		
	renderRows(){
		return this.props.feedbackItems.map((feedback, i)=>{
			return	<TableRow key = {i} 
				title={feedback.title}
				votes = {feedback.votes}
				description = {feedback.description}
				published = {feedback.published}

			/>;
		});
	}

	render(){
		return(
			<div className = "row">
				<div className="col-md-12">
					<table width='100%' className="table table-striped">
						<thead className='thead-default'>
							<tr>
								<th>Title</th>
								<th>Votes</th>
								<th>Description</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>    
						<tbody>
							{this.renderRows()}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

FeedbackTable.propTypes = {
	feedbackItems:PropTypes.array
};
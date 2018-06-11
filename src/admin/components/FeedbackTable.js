import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

class DeleteFeedbackModal extends React.Component{

	render(){
		return(
			<Modal visible={this.props.show} onClickBackdrop={this.props.hideModal}>
				<div className="modal-header">
					<h5 className="modal-title">Delete Feedback</h5>
					<button type="button" className="close"  aria-label="Close" onClick = {this.props.hideModal}>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div className="modal-body">
					<p>Really Delete ? <br/> This cannot be undone. </p>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-secondary" onClick={this.props.hideModal}>Cancel</button>
					<button type="button" className="btn btn-danger" onClick={()=>this.props.deleteFeedback(this.props.id)}>Delete</button>
				</div>
			</Modal>
		);
	}
}

DeleteFeedbackModal.propTypes = {
	show: PropTypes.bool,
	hideModal: PropTypes.func,
	id: PropTypes.string,
	deleteFeedback: PropTypes.func,
};

class TableRow extends React.Component{
	constructor(props){
		super(props);

		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);

		this.state = {
			showModal: false
		};
	}

	showModal(){
		this.setState({showModal:true});
	}
	hideModal(){
		this.setState({showModal:false});
	}

	render(){
		return(
			<tr>
				<td>{this.props.title}</td>
				<td>{this.props.votes}</td>
				<td>{this.props.description}</td>
				<td>{this.props.published ? 'Published': 'Unpublished'}</td>
				<td>
					<button onClick = {()=>this.props.togglePublished(this.props.id, this.props.published)} className = "btn btn-primary">{this.props.published? 'Unpublish' : 'Publish'}</button> &nbsp; 
					<button onClick= {this.showModal}  className = "btn btn-danger">Delete</button>
					<DeleteFeedbackModal  hideModal = {this.hideModal} show = {this.state.showModal} deleteFeedback = {this.props.deleteFeedback} id={this.props.id} />
				</td>
			</tr>
		);
	}
}

TableRow.propTypes = {
	title: PropTypes.string,
	votes: PropTypes.number,
	description: PropTypes.string,
	published: PropTypes.bool,
	togglePublished: PropTypes.func,
	deleteFeedback: PropTypes.func,
	id: PropTypes.string,

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
				id = {feedback._id}
				togglePublished = {this.props.togglePublished}
				deleteFeedback = {this.props.deleteFeedback}

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
	feedbackItems:PropTypes.array,
	togglePublished: PropTypes.func,
	deleteFeedback: PropTypes.func
};
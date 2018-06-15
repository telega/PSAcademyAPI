import React from 'react';
import PropTypes from 'prop-types';
import NavBar from '../components/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import axios from 'axios';
import Modal from 'react-bootstrap4-modal';

class DeleteTermModal extends React.Component{

	render(){
		return(
			<Modal visible={this.props.show} onClickBackdrop={this.props.hideModal}>
				<div className="modal-header">
					<h5 className="modal-title">Delete Term</h5>
					<button type="button" className="close"  aria-label="Close" onClick = {this.props.hideModal}>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div className="modal-body">
					<p>Really Delete {this.props.heading}? <br/> This cannot be undone. </p>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-secondary" onClick={this.props.hideModal}>Cancel</button>
					<button type="button" className="btn btn-danger" onClick={()=>this.props.deleteTerm(this.props.id)}>Delete</button>
				</div>
			</Modal>
		);
	}
}

DeleteTermModal.propTypes = {
	show: PropTypes.bool,
	hideModal: PropTypes.func,
	id: PropTypes.string,
	deleteFeedback: PropTypes.func,
	heading:PropTypes.string,
	deleteTerm: PropTypes.func
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
				<td> {this.props.heading} </td>
				<td>
					<a href = {this.props.url} className = "btn btn-primary">Edit</a> 
					<button onClick= {this.showModal}  className = "btn btn-danger">Delete</button>
					<DeleteTermModal  hideModal = {this.hideModal} show = {this.state.showModal} deleteTerm = {this.props.deleteTerm} id={this.props.id} heading = {this.props.heading}/>
				</td>
			</tr>
			
		);
	}
}

TableRow.propTypes = {
	heading: PropTypes.string,
	url: PropTypes.string,
	id: PropTypes.string,
	deleteTerm: PropTypes.func,
};

class TermTable extends React.Component{

	constructor(props){
		super(props);
		this.renderTableRows = this.renderTableRows.bind(this);
	}

	renderTableRows(){
		return this.props.glossaryTerms.map((gt,i)=>{
			let url = '/admin/glossary/' + gt.id;
			return <TableRow url={url} key = {i} id={gt.id} heading={gt.heading} deleteTerm = {this.props.deleteTerm}/>;
		});
	}

	render(){
		return(
			<div>
				<table  width='100%' className="table table-striped">
					<thead className = 'thead-default'>
						<tr>
							<th>Heading</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{this.renderTableRows()}
					</tbody>
				</table>
			</div>
		);
	}
}

TermTable.propTypes = {
	glossaryTerms: PropTypes.array,
	deleteTerm: PropTypes.func,
};


export default class AdminGlossary extends React.Component{

	constructor(props){
		super(props);

		this.deleteTerm = this.deleteTerm.bind(this);
		this.state={
			glossaryTerms: []
		};
	}

	deleteTerm(id){
		axios.delete('/api/glossary/' + id )
			.then(()=>{
				this.updateTermList();
			})
			.catch((err)=>{console.log(err);});
	}



	updateTermList(){
		axios.get('/api/glossary')
			.then((response)=>{
				return response.data.map((gt) => {
					return {
						heading: gt.heading,
						id: gt._id,
					};
				});
			})
			.then((glossaryTerms)=>{
				this.setState({
					glossaryTerms: glossaryTerms
				});
			})
			.catch((err)=>{
				console.log(err);
			});
	}

	componentDidMount(){
		this.updateTermList();
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

							<TermTable 
								glossaryTerms = {this.state.glossaryTerms}
								deleteTerm = {this.deleteTerm}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

AdminGlossary.propTypes = {
	activeNavItem: PropTypes.string,
	breadCrumbs: PropTypes.array
};
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import axios from 'axios';

export default class AddCourseUnitModal extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			unitName: '',
			unitDescription: '',
			unitOrder: 1
		};

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
	}

	handleFormChange(event){
		const target = event.target;
		const name = target.name;
		const value = target.value;

		this.setState({
			[name]: value
		});
	}

	handleConfirm(){
		axios.post('/api/courses/' + this.props.courseId + '/units', {
			name: this.state.unitName,
			description: this.state.unitDescription,
			order: this.state.unitOrder
		})
			.then(()=>{
				this.props.update();
				this.props.handleClose();
			})
			.catch((err)=>{console.log(err);});
	}

	render(){
		return (
			<Modal visible={this.props.show} onClickBackdrop={this.props.handleClose}>
				<div className="modal-header">
					<h5 className="modal-title">Add Unit</h5>
					<button type="button" className="close"  aria-label="Close" onClick = {this.props.handleClose}>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div className="modal-body">
					<form id = "addCourse">
						<div className="form-group">
							<label htmlFor="courseName">Unit Name*</label>
							<input required type="text" className="form-control" id="unitName" name='unitName' placeholder="Name" value={this.state.unitName} onChange = {this.handleFormChange} />
						</div>
						<div className="form-group">
							<label htmlFor="courseDescription">Unit Description</label>
							<input type="textarea" className="form-control" id="unitDescription" name='unitDescription' placeholder="Unit Description" value={this.state.unitDescription} onChange = {this.handleFormChange}/>
						</div>
						<div className="form-group">
							<label htmlFor="courseOrder">Order</label>
							<input type="number" className="form-control" name='unitOrder' id="unitOrder" value={this.state.unitOrder} onChange = {this.handleFormChange} />
						</div>
					</form>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-secondary" onClick={this.props.handleClose}>Cancel</button>
					<button type="button" className="btn btn-success" onClick={this.handleConfirm}>Add Unit</button>
				</div>
			</Modal>
		);
	}
}

AddCourseUnitModal.propTypes = {
	courseId: PropTypes.string,
	update: PropTypes.func,
	handleClose: PropTypes.func,
	show: PropTypes.bool
};
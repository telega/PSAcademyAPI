import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import axios from 'axios';
import _ from 'lodash';

export default class AddCourseUnitModuleModal extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			moduleName: '',
			moduleDescription: '',
			moduleType: ['Video'],
			moduleOrder: 1
		};

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleRadioChange = this.handleRadioChange.bind(this);
	}

	handleRadioChange(event){
		let value = event.target.value;
		this.setState({moduleType: [value]}, ()=>{console.log(this.state);});
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
		axios.post('/api/courses/' + this.props.courseId + '/units/' + this.props.unitId + '/modules', {
			name: this.state.moduleName,
			description: this.state.moduleDescription,
			order: this.state.moduleOrder,
			type: this.state.moduleType[0],
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
					<h5 className="modal-title">Add Module</h5>
					<button type="button" className="close"  aria-label="Close" onClick = {this.props.handleClose}>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div className="modal-body">
					<form id = "addCourse">
						<div className="form-group">
							<label htmlFor="courseName">Module Name*</label>
							<input required type="text" className="form-control" id="moduleName" name='moduleName' placeholder="Name" value={this.state.moduleName} onChange = {this.handleFormChange} />
						</div>
						<div className="form-group">
							<label htmlFor="courseDescription">Module Description</label>
							<input type="textarea" className="form-control" id="moduleDescription" name='moduleDescription' placeholder="Description" value={this.state.moduleDescription} onChange = {this.handleFormChange}/>
						</div>
						<div className="form-group">
							<label htmlFor="courseOrder">Order</label>
							<input type="number" className="form-control" name='moduleOrder' id="moduleOrder" value={this.state.moduleOrder} onChange = {this.handleFormChange} />
						</div>
						<div className = 'radio'>
							<label>
								<input type='radio' value = 'Video' checked ={ (_.indexOf(this.state.moduleType, 'Video' ) !== -1) } onChange = {this.handleRadioChange} /> 
								&nbsp;Video
							</label>
						</div>
						<div className = 'radio'>
							<label>
								<input type='radio' value = 'Quiz' checked ={ (_.indexOf(this.state.moduleType, 'Quiz' ) !== -1) } onChange = {this.handleRadioChange} /> 
								&nbsp;Quiz
							</label>
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

AddCourseUnitModuleModal.propTypes = {
	courseId: PropTypes.string,
	update: PropTypes.func,
	handleClose: PropTypes.func,
	show: PropTypes.bool,
	unitId: PropTypes.string,
};
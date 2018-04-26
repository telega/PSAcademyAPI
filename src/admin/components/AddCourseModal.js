import React from 'react';
import Modal from 'react-bootstrap4-modal';
import axios from 'axios';

export default class AddCourseModal extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			courseName: '',
			courseDescription: '',
			courseOrder: 1
		}
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
	}

	handleFormChange(event){
		 const target = event.target;
		 const name = target.name;
		 const value = target.value;

		 this.setState({
			 [name]: value
		 })
	}

	handleConfirm(){
		axios.post('/api/courses', {
			name: this.state.courseName,
			description: this.state.courseDescription,
			order: this.state.courseOrder
		})
		.then(()=>{
			this.props.update();
			this.props.handleClose();
		})
		.catch((err)=>{console.log(err)})
	}

	render(){
		return (
			<Modal visible={this.props.show} onClickBackdrop={this.props.handleClose}>
      		  <div className="modal-header">
      		    <h5 className="modal-title">Add Course</h5>
				  <button type="button" className="close"  aria-label="Close" onClick = {this.props.handleClose}>
      		    		<span aria-hidden="true">&times;</span>
      		  	</button>
      		  </div>
      		  <div className="modal-body">
				<form id = "addCourse">
        		    <div className="form-group">
        		      <label htmlFor="courseName">Course Name*</label>
        		      <input required type="text" className="form-control" id="courseName" name='courseName' placeholder="Name" value={this.state.courseName} onChange = {this.handleFormChange} />
        		    </div>
        		    <div className="form-group">
        		      <label htmlFor="courseDescription">Course Description</label>
        		      <input type="textarea" className="form-control" id="courseDescription" name='courseDescription' placeholder="Course Description" value={this.state.courseDescription} onChange = {this.handleFormChange}/>
        		    </div>
        		    <div className="form-group">
        		      <label htmlFor="courseOrder">Order</label>
        		      <input type="number" className="form-control" name='courseOrder' id="courseOrder" value={this.state.courseOrder} onChange = {this.handleFormChange} />
        		    </div>
        		</form>
      		  </div>
      		  <div className="modal-footer">
      		    <button type="button" className="btn btn-secondary" onClick={this.props.handleClose}>
      		      Cancel
      		    </button>
      		    <button type="button" className="btn btn-success" onClick={this.handleConfirm}>
      		      Add Course
      		    </button>
      		  </div>
      		</Modal>
		)
	}
}
import React from 'react';
import Modal from 'react-bootstrap4-modal';
import axios from 'axios';

export default class DeleteCourseButton extends React.Component{

	constructor(props) {
		super(props);
	
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
	
		this.state = {
		  show: false
		};
	  }
	
	  handleClose() {
		this.setState({ show: false });
	  }
	
	  handleShow() {
		this.setState({ show: true });
	  }

	  handleConfirm() {
			axios.delete(this.props.url)
			.then(()=>{
				this.props.handleUpdate();
		  		//this.setState({ show: false});
			})
			.catch((err)=>{
				console.log(err);
			});
	  }
	

	render(){
		return (
			<span>
				<button className = "btn btn-danger" onClick={this.handleShow}> Delete </button>
				<Modal visible={this.state.show} onClickBackdrop={this.handleClose}>
      			  <div className="modal-header">
      			    <h5 className="modal-title">Delete Course</h5>
					  <button type="button" className="close"  aria-label="Close" onClick = {this.handleClose}>
      			    		<span aria-hidden="true">&times;</span>
      			  	</button>
      			  </div>
      			  <div className="modal-body">
      			    <p>Really Delete <strong> {this.props.name} </strong>? <br/> This cannot be undone. </p>
      			  </div>
      			  <div className="modal-footer">
      			    <button type="button" className="btn btn-secondary" onClick={this.handleClose}>
      			      Cancel
      			    </button>
      			    <button type="button" className="btn btn-danger" onClick={this.handleConfirm}>
      			      Delete
      			    </button>
      			  </div>
      			</Modal>
			</span>
		);
	}
}
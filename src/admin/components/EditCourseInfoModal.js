import React from 'react';
import Modal from 'react-bootstrap4-modal';
import axios from 'axios';

export default class EditCourseInfoModal extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			title:this.props.title,
			newValue:''
		}
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.title === prevState.title){
			return null;
		}
		return {
			title:nextProps.title
		};
	}


	handleFormChange(event){
		const target = event.target;
		const name = target.name;
		const value = target.value;

		this.setState({
			[name]: value
		})
   }

   closeModal(){
	   this.props.handleClose(this.props.fieldName)
   }

	handleConfirm(){

		axios.put('/api/courses/' + this.props._id, {
			[this.props.fieldName]: this.state.newValue,
		})
		.then(()=>{
			this.props.update();
			this.closeModal();
		})
		.catch((err)=>{console.log(err)})
	}

	render(){
		return(

			<Modal visible={this.props.show} onClickBackdrop={this.closeModal}>
      		  <div className="modal-header">
      		    <h5 className="modal-title">Update {this.props.fieldTitle}</h5><button type="button" className="close"  aria-label="Close" onClick = {this.closeModal}>
      		    		<span aria-hidden="true">&times;</span>
      		  	</button>				 
      		  </div>
      		  <div className="modal-body">
				<form id = "updateCourse">
        		    <div className="form-group">
        		      <label htmlFor="newValue">New {this.props.fieldTitle}:</label>
        		      <input required type={this.props.fieldType} className="form-control" id="newValue" name='newValue' placeholder={this.state.title} value={this.state.newValue} onChange = {this.handleFormChange} />
        		    </div>
        		</form>

      		  </div>
      		  <div className="modal-footer">
				<button type="button" className="btn btn-secondary" onClick={this.closeModal}>
      		      Cancel
      		    </button>
      		    <button type="button" className="btn btn-success" onClick={this.handleConfirm}>
      		      Update {this.props.fieldTitle}
      		    </button>
      		  </div>
      		</Modal>

		)
	}
}

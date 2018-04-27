import React from 'react';
import axios from 'axios';
import EditCourseInfoModal from './EditCourseInfoModal'

class EditButton extends React.Component{
	constructor(props){
		super(props)
		this.handleButtonClick = this.handleButtonClick.bind(this);
	}

	handleButtonClick(){
		this.props.handleClick(this.props.name)
	}

	render(){
		return (
			<button onClick={this.handleButtonClick} className="btn btn-secondary"><span className="fa fa-pencil" aria-hidden="true"></span></button>
		)
	}
}

export default class EditCourseTable extends React.Component{
	constructor(props){
		super(props)

		this.updateCourseInfo = this.updateCourseInfo.bind(this);
		this.showEditModal = this.showEditModal.bind(this);
		this.hideEditModal = this.hideEditModal.bind(this);

		this.state = {
			course: {},
			showModals:{
				name:false,
				description:false
			},
			showModal:false
		}
	}

	showEditModal(modalName){
		let showModals = {...this.state.showModals, [modalName]:true };
		this.setState({showModals:showModals});
	}

	hideEditModal(modalName){
		let showModals = {...this.state.showModals, [modalName]:false };
		this.setState({showModals:showModals});
	}

	componentDidMount(){
		this.updateCourseInfo();
	}

	updateCourseInfo(){
		axios.get('/api/courses/' + this.props._id)
			.then((response)=>{			
				this.setState({course:response.data})
			})
	}

	render(){
		return (
			<div className = "row">
        		<div className = "col-md-12">
       			<table width='100%' className="table table-striped">
            		<thead className='thead-default'>
						<tr>
            		  		<th></th>
            		  		<th></th>
            		  		<th>Edit</th>
						</tr>
            		</thead>

					<tbody>
                <tr>
                    <td><strong>Course Name</strong></td>
                    <td>{this.state.course.name}</td>
                     <td><EditCourseInfoModal update = {this.updateCourseInfo} _id = {this.state.course._id} name={'name'} title = {this.state.course.name} handleClose={this.hideEditModal} fieldTitle={'Course Name'} fieldName = {'name'} show = {this.state.showModals.name}/>
						<EditButton name = {'name'} handleClick = {this.showEditModal} />
					</td>
				</tr>
                <tr>
                    <td><strong>Description</strong></td>
                    <td>{this.state.course.description}</td>
                    <td><EditCourseInfoModal update = {this.updateCourseInfo} _id = {this.state.course._id} name={'description'} title = {this.state.course.description} handleClose={this.hideEditModal} fieldTitle={'Course Description'} fieldName = {'description'} show = {this.state.showModals.description}/>
						<EditButton name = {'description'} handleClick = {this.showEditModal} /></td>
                </tr>
                <tr>
                    <td><strong>Order</strong></td>
                    <td>{this.state.course.order}</td>
                    <td><button data-toggle="modal" data-target="#updateOrderModal" className="btn btn-secondary"><span className="fa fa-pencil" aria-hidden="true"></span></button></td>
                </tr>
                <tr>
                    <td><strong>Course Images</strong></td>
                    <td>
                      <table className="table" >
                        <thead className='thead-default'>
							<tr>
                          	<th>Main</th>
                          	<th>Thumbnail</th>
						  </tr>
                        </thead>
                        <tbody>
                          	<tr >
                            	<td className = 'courseImages'><img src = {this.state.course.courseImageUrl} className="img-fluid" /></td>
                           	 	<td className = 'courseImages'><img src = {this.state.course.courseThumbImageUrl} className="img-fluid" /></td>
                          	</tr>
						  </tbody>
                      </table>
                    </td>
                    <td><button data-toggle="modal" data-target="#updateImageModal" className="btn btn-secondary"><span className="fa fa-pencil" aria-hidden="true"></span></button></td>
                </tr>
    
                <tr>
                    <td><strong>Status</strong></td>
                    <td>{String(this.state.course.published)}           </td>
                    <td>
                          <button data-toggle= "modal" data-target="#updateStatusModal"  className="btn btn-primary">Publish</button>
                    </td>
                </tr>
            </tbody>


					</table>
				</div>
			</div>
		);
	}
}

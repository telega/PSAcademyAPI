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

class PublishToggleRow extends React.Component{

	render(){
		console.log('render')
	if(this.props.published == true){
		return(
			<tr>
				<td><strong>Status</strong></td>
				<td>Published</td>
				<td><button onClick={this.props.togglePublished}  className="btn btn-warning">Unpublish</button></td>
			</tr>
		)
	}
	else {
		return(
			<tr>
				<td><strong>Status</strong></td>
				<td>Unpublished</td>
				<td><button  onClick={this.props.togglePublished} className="btn btn-danger">Publish</button></td>
			</tr>
		)
	}
}
	

}

export default class EditCourseTable extends React.Component{
	constructor(props){
		super(props)

		this.updateCourseInfo = this.updateCourseInfo.bind(this);
		this.showEditModal = this.showEditModal.bind(this);
		this.hideEditModal = this.hideEditModal.bind(this);
		this.togglePublished = this.togglePublished.bind(this);

		this.state = {
			course: {},
			showModals:{
				name:false,
				description:false,
				order:false,
				courseImageUrl:false,
				courseThumbImageUrl:false
			},
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

	togglePublished(){

		axios.put('/api/courses/' + this.state.course._id, {
			published: !this.state.course.published
		})
		.then((res)=>{
			this.updateCourseInfo();
		})
		.catch((err)=>{console.log(err)})
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
                     <td><EditCourseInfoModal update = {this.updateCourseInfo} _id = {this.state.course._id} fieldType={'text'} title = {this.state.course.name} handleClose={this.hideEditModal} fieldTitle={'Course Name'} fieldName = {'name'} show = {this.state.showModals.name}/>
						<EditButton name = {'name'} handleClick = {this.showEditModal} />
					</td>
				</tr>
                <tr>
                    <td><strong>Description</strong></td>
                    <td>{this.state.course.description}</td>
                    <td><EditCourseInfoModal update = {this.updateCourseInfo} _id = {this.state.course._id} fieldType={'textarea'} title = {this.state.course.description} handleClose={this.hideEditModal} fieldTitle={'Course Description'} fieldName = {'description'} show = {this.state.showModals.description}/>
						<EditButton name = {'description'} handleClick = {this.showEditModal} /></td>
                </tr>
                <tr>
                    <td><strong>Order</strong></td>
                    <td>{this.state.course.order}</td>
					<td><EditCourseInfoModal update = {this.updateCourseInfo} _id = {this.state.course._id} fieldType={'number'} title = {String(this.state.course.order)} handleClose={this.hideEditModal} fieldTitle={'Order'} fieldName = {'order'} show = {this.state.showModals.order}/>
						<EditButton name = {'order'} handleClick = {this.showEditModal} />
						</td> 
				</tr>
				<tr>
                    <td><strong>Main Image</strong></td>
                    <td className = 'courseImages'><img src = {this.state.course.courseImageUrl} className="img-fluid" /></td>
					<td><EditCourseInfoModal update = {this.updateCourseInfo} _id = {this.state.course._id} fieldType={'text'} title = {String(this.state.course.courseImageUrl)} handleClose={this.hideEditModal} fieldTitle={'Course Image'} fieldName = {'courseImageUrl'} show = {this.state.showModals.courseImageUrl}/>
						<EditButton name = {'courseImageUrl'} handleClick = {this.showEditModal} />
						</td> 
				</tr>
				<tr>
                    <td><strong>Thumbnail Image </strong></td>
					<td className = 'courseImages'><img src = {this.state.course.courseThumbImageUrl} className="img-fluid" /></td>	
					<td><EditCourseInfoModal update = {this.updateCourseInfo} _id = {this.state.course._id} fieldType={'text'} title = {String(this.state.course.courseThumbImageUrl)} handleClose={this.hideEditModal} fieldTitle={'Thumbnail Image'} fieldName = {'courseThumbImageUrl'} show = {this.state.showModals.courseThumbImageUrl}/>
						<EditButton name = {'courseThumbImageUrl'} handleClick = {this.showEditModal} />
						</td> 
				</tr>

					<PublishToggleRow published = {this.state.course.published} togglePublished={this.togglePublished}  />
               
           	 	</tbody>
				</table>
				</div>
			</div>
		);
	}
}

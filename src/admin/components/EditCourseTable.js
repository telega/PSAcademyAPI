import React from 'react';
import axios from 'axios';
import EditCourseInfoModal from './EditCourseInfoModal';
import AddCourseUnitModal from './AddCourseUnitModal';
import ConfirmModal from './ConfirmModal';

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

class UnitTableRow extends React.Component{
	constructor(props){
		super(props);

		this.deleteUnit = this.deleteUnit.bind(this);
		this.showConfirmModal = this.showConfirmModal.bind(this);
		this.hideConfirmModal = this.hideConfirmModal.bind(this);

		this.state = {
			showConfirmModal: false
		}
	}

	deleteUnit(){
		axios.delete('/api/courses/' + this.props.courseId + '/units/' + this.props.unitId)
		.then(()=>{
			this.props.update();
		})
		.catch((err)=>{console.log(err)});
	}

	showConfirmModal(){
		this.setState({showConfirmModal:true});
	}

	hideConfirmModal(){
		this.setState({showConfirmModal:false});
	}

	render(){
		return(
				<tr>
					<td>{this.props.order}</td>
					<td>{this.props.name}</td>
					<td>{this.props.published ? 'Published' : 'Draft'} </td>
					<td>
					<a href = {"/admin/courses/" + this.props.courseId +  "/units/"  + this.props.unitId } className = "btn btn-secondary"> <span className="fa fa-pencil" aria-hidden="true"></span> </a> &nbsp;
					<button onClick = {this.showConfirmModal} className = "btn btn-danger">Delete</button>
					<ConfirmModal children={<p>Really delete <strong>{this.props.name} ?</strong></p>} visible = {this.state.showConfirmModal} onOK = {this.deleteUnit} onCancel = {this.hideConfirmModal} />
					</td>
				</tr>
		)
	}
}

class UnitTable extends React.Component{
	constructor(props){
		super(props);
	
		this.renderUnitTableRows = this.renderUnitTableRows.bind(this);
	}

	renderUnitTableRows(){
		return(this.props.units.map((unit,i)=>{
					return	<UnitTableRow key={i} update={this.props.update} order = {unit.order} name = {unit.name} published={unit.published} unitId = {unit._id} courseId = {this.props.courseId}/>
				})
		)
	}

	render(){

		if(this.props.units.length > 0){
			return(

				<div className = "row">
				<div className = "col-md-12">
				<h3>Course Units</h3>
				<table width='100%' className="table table-striped">
					<thead className = 'thead-default' >
						<tr>
							<th>#</th>
							<th>Unit Name</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>    
					<tbody>
						{this.renderUnitTableRows()}
					</tbody>
					</table>
				</div>
			</div>

			);
		}
		
		return null;
		
	}
}

class PublishToggleRow extends React.Component{

	render(){
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
		this.showAddCourseUnitModal = this.showAddCourseUnitModal.bind(this);
		this.hideAddCourseUnitModal = this.hideAddCourseUnitModal.bind(this);

		this.state = {
			course: {
				units:[]
			},
			showModals:{
				name:false,
				description:false,
				order:false,
				courseImageUrl:false,
				courseThumbImageUrl:false,
				addCourseUnitModal:false
			},
		}
	}

	showAddCourseUnitModal(){
		let showModals = { ...this.state.showModals, addCourseUnitModal:true };
		this.setState({showModals:showModals})
	}

	hideAddCourseUnitModal(){
		let showModals = {...this.state.showModals, addCourseUnitModal:false };
		this.setState({showModals:showModals})
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
			.catch((err)=>{console.log(err)})
	}

	render(){
		return (
			<div>
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

			<UnitTable units = {this.state.course.units} courseId = {this.state.course._id} update = {this.updateCourseInfo}/>

			<div className = "row">
        		<div className="col-md-12">
					<button className = 'btn btn-primary ' onClick = {this.showAddCourseUnitModal}> <span className="fa fa-plus" aria-hidden="true"></span> Add a New Unit</button>
					<AddCourseUnitModal courseId = {this.state.course._id}show = {this.state.showModals.addCourseUnitModal} handleClose = {this.hideAddCourseUnitModal} update={this.updateCourseInfo} />
       			 </div>
    		</div>
			
			</div>
		);
	}
}

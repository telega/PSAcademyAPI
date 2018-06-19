import React from 'react';
import axios from 'axios';
import EditUnitInfoModal from './EditUnitInfoModal';
import AddCourseUnitModuleModal from './AddCourseUnitModuleModal';
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

class ModuleTableRow extends React.Component{
	constructor(props){
		super(props);

		this.deleteModule = this.deleteModule.bind(this);
		this.showConfirmModal = this.showConfirmModal.bind(this);
		this.hideConfirmModal = this.hideConfirmModal.bind(this);

		this.state = {
			showConfirmModal: false
		}
	}

	deleteModule(){
		axios.delete('/api/courses/' + this.props.courseId + '/units/' + this.props.unitId + '/modules/' + this.props.moduleId)
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
					<a href = {"/admin/courses/" + this.props.courseId +  "/units/"  + this.props.unitId + '/modules/' + this.props.moduleId} className = "btn btn-secondary"> <span className="fa fa-pencil" aria-hidden="true"></span> </a> &nbsp;
					<button onClick = {this.showConfirmModal} className = "btn btn-danger">Delete</button>
					<ConfirmModal children={<p>Really delete <strong>{this.props.name} ?</strong></p>} visible = {this.state.showConfirmModal} onOK = {this.deleteModule} onCancel = {this.hideConfirmModal} />
					</td>
				</tr>
		)
	}
}

class ModuleTable extends React.Component{
	constructor(props){
		super(props);
	
		this.renderModuleTableRows = this.renderModuleTableRows.bind(this);
	}

	renderModuleTableRows(){
		return(this.props.modules.map((module,i)=>{
					return	<ModuleTableRow key={i} update={this.props.update} order = {module.order} name = {module.name} published={module.published} unitId = {this.props.unitId} moduleId={module._id} courseId = {this.props.courseId}/>
				})
		)
	}

	render(){

		if(this.props.modules.length > 0){
			return(

				<div className = "row">
				<div className = "col-md-12">
				<h3>Modules</h3>
				<table width='100%' className="table table-striped">
					<thead className = 'thead-default' >
						<tr>
							<th>#</th>
							<th>Module Name</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>    
					<tbody>
						{this.renderModuleTableRows()}
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

export default class EditUnitTable extends React.Component{
	constructor(props){
		super(props)

		this.updateUnitInfo = this.updateUnitInfo.bind(this);
		this.showEditModal = this.showEditModal.bind(this);
		this.hideEditModal = this.hideEditModal.bind(this);
		this.togglePublished = this.togglePublished.bind(this);
		this.showAddCourseUnitModuleModal = this.showAddCourseUnitModuleModal.bind(this);
		this.hideAddCourseUnitModuleModal = this.hideAddCourseUnitModuleModal.bind(this);

		this.state = {
			unit: {
				modules:[]
			},
			showModals:{
				name:false,
				description:false,
				shortDescription:false,
				order:false,
				unitImageUrl:false,
				unitThumbImageUrl:false,
				addCourseUnitModuleModal:false
			},
		}
	}

	showAddCourseUnitModuleModal(){
		let showModals = {...this.state.showModals, addCourseUnitModuleModal:true };
		this.setState({showModals:showModals})
	}

	hideAddCourseUnitModuleModal(){
		let showModals = {...this.state.showModals, addCourseUnitModuleModal:false };
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
		this.updateUnitInfo();
	}

	togglePublished(){

		axios.put('/api/courses/' + this.props.courseId + '/units/' + this.props.unitId, {
			published: !this.state.unit.published
		})
		.then((res)=>{
			this.updateUnitInfo();
		})
		.catch((err)=>{console.log(err)})
	}

	updateUnitInfo(){

		axios.get('/api/courses/' + this.props.courseId + '/units/' + this.props.unitId)
			.then((response)=>{			
				this.setState({unit:response.data})
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
                    <td><strong>Unit Name</strong></td>
                    <td>{this.state.unit.name}</td>
                     <td><EditUnitInfoModal update = {this.updateUnitInfo} courseId = {this.props.courseId } unitId = {this.state.unit._id} fieldType={'text'} title = {this.state.unit.name} handleClose={this.hideEditModal} fieldTitle={'Unit Name'} fieldName = {'name'} show = {this.state.showModals.name}/>
						<EditButton name = {'name'} handleClick = {this.showEditModal} />
					</td>
				</tr>
                <tr>
                    <td><strong>Description</strong></td>
                    <td>{this.state.unit.description}</td>
                    <td><EditUnitInfoModal update = {this.updateUnitInfo} courseId = {this.props.courseId} unitId = {this.state.unit._id} fieldType={'textarea'} title = {this.state.unit.description} handleClose={this.hideEditModal} fieldTitle={'Unit Description'} fieldName = {'description'} show = {this.state.showModals.description}/>
						<EditButton name = {'description'} handleClick = {this.showEditModal} /></td>
                </tr>
				<tr>
                    <td><strong>Short Description</strong></td>
                    <td>{this.state.unit.shortDescription}</td>
                    <td><EditUnitInfoModal update = {this.updateUnitInfo} courseId = {this.props.courseId} unitId = {this.state.unit._id} fieldType={'textarea'} title = {this.state.unit.shortDescription} handleClose={this.hideEditModal} fieldTitle={'Short Description'} fieldName = {'shortDescription'} show = {this.state.showModals.shortDescription}/>
						<EditButton name = {'shortDescription'} handleClick = {this.showEditModal} /></td>
                </tr>
                <tr>
                    <td><strong>Order</strong></td>
                    <td>{this.state.unit.order}</td>
					<td><EditUnitInfoModal update = {this.updateUnitInfo} courseId = {this.props.courseId} unitId = {this.state.unit._id} fieldType={'number'} title = {String(this.state.unit.order)} handleClose={this.hideEditModal} fieldTitle={'Order'} fieldName = {'order'} show = {this.state.showModals.order}/>
						<EditButton name = {'order'} handleClick = {this.showEditModal} />
						</td> 
				</tr>
				<tr>
                    <td><strong>Main Image</strong></td>
                    <td className = 'courseImages'><img src = {this.state.unit.unitImageUrl} className="img-fluid" /></td>
					<td><EditUnitInfoModal update = {this.updateUnitInfo} courseId={this.props.courseId} unitId = {this.state.unit._id} fieldType={'text'} title = {String(this.state.unit.unitImageUrl)} handleClose={this.hideEditModal} fieldTitle={'Unit Image'} fieldName = {'unitImageUrl'} show = {this.state.showModals.unitImageUrl}/>
						<EditButton name = {'unitImageUrl'} handleClick = {this.showEditModal} />
						</td> 
				</tr>
				<tr>
                    <td><strong>Thumbnail Image </strong></td>
					<td className = 'courseImages'><img src = {this.state.unit.unitThumbImageUrl} className="img-fluid" /></td>	
					<td><EditUnitInfoModal update = {this.updateUnitInfo} courseId={this.props.courseId} unitId = {this.state.unit._id} fieldType={'text'} title = {String(this.state.unit.unitThumbImageUrl)} handleClose={this.hideEditModal} fieldTitle={'Unit Thumbnail Image'} fieldName = {'unitThumbImageUrl'} show = {this.state.showModals.unitThumbImageUrl}/>
						<EditButton name = {'unitThumbImageUrl'} handleClick = {this.showEditModal} />
						</td> 
				</tr>

					<PublishToggleRow published = {this.state.unit.published} togglePublished={this.togglePublished}  />
               
           	 	</tbody>
				</table>
				</div>
			</div>

			<ModuleTable modules = {this.state.unit.modules} courseId = {this.props.courseId} unitId = {this.props.unitId} update = {this.updateUnitInfo}/>

			<div className = "row">
        		<div className="col-md-12">
					<button className = 'btn btn-primary ' onClick = {this.showAddCourseUnitModuleModal}> <span className="fa fa-plus" aria-hidden="true"></span> Add a New Module</button>
					<AddCourseUnitModuleModal courseId = {this.props.courseId} unitId = {this.props.unitId} show = {this.state.showModals.addCourseUnitModuleModal} handleClose = {this.hideAddCourseUnitModuleModal} update={this.updateUnitInfo} />
       			 </div>
    		</div>
			
			</div>
		);
	}
}

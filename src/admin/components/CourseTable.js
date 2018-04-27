import React from 'react';
import EditCourseButton from './EditCourseButton';
import DeleteCourseButton from './DeleteCourseButton';
import axios from 'axios';
import AddCourseModal from './AddCourseModal'

class TableRow extends React.Component{

	render(){
		return(
			<tr>
				<td>{this.props.order}</td>
				<td>{this.props.name}</td>
				<td>{this.props.published.toString()}</td>
				<td><EditCourseButton url = {'/admin/courses/' + this.props._id}/> <DeleteCourseButton url = {'/api/courses/' + this.props._id} name = {this.props.name} handleUpdate = {this.props.handleUpdate}/> </td>
			</tr>
		)
	}
}

export default class CourseTable extends React.Component{

	constructor(props) {
		super(props);
	
		this.updateCourseList = this.updateCourseList.bind(this);
		this.showAddCourseModal= this.showAddCourseModal.bind(this);
		this.hideAddCourseModal = this.hideAddCourseModal.bind(this);

		this.state = {
			courses:[],
			showAddCourseModal: false,
		};
	  }

	updateCourseList(){
		axios.get('/api/courses')
			.then((response)=>{
				let courses = response.data.map((c) => {
					return {
						order: c.order,
						name: c.name,
						published: c.published,
						_id: c._id
					}
				});
				this.setState({
					courses: courses
				});
			})
			.catch((err)=>{
				console.log(err);
			});
	}
	
	showAddCourseModal(){
		this.setState({showAddCourseModal:true})
	}

	hideAddCourseModal(){
		this.setState({showAddCourseModal:false})
	}

	componentDidMount(){
		this.updateCourseList();
	}


	renderRows(){
		return this.state.courses.map((course, i)=>{
			return	<TableRow key = {i} order = {course.order} name = {course.name} published = {course.published} _id = {course._id} handleUpdate = {this.updateCourseList} />
	})}

	render(){
		return(
			<div className = "row">
        		<div className="col-md-12">
            		<table width='100%' className="table table-striped">
            			<thead className='thead-default'>
						<tr>
                			<th>#</th>
                			<th>Course Name</th>
                			<th>Status</th>
                			<th>Actions</th>
							</tr>
            			</thead>    
            			<tbody>
							{this.renderRows()}
            			</tbody>
            		</table>
					<button className = 'btn btn-primary ' onClick = {this.showAddCourseModal}> <span className="fa fa-plus" aria-hidden="true"></span> Add a New Course</button>
					<AddCourseModal show = {this.state.showAddCourseModal} handleClose = {this.hideAddCourseModal} update={this.updateCourseList} />
       			 </div>
    		</div>
		);
	}
}


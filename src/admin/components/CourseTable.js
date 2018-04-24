import React from 'react';
import Modal from 'react-bootstrap4-modal';
import EditButton from './EditButton';
import DeleteCourseButton from './DeleteCourseButton';
import axios from 'axios';

class TableRow extends React.Component{

	render(){
		return(
			<tr>
				<td>{this.props.order}</td>
				<td>{this.props.name}</td>
				<td>{this.props.published.toString()}</td>
				<td><EditButton url = {'/admin/courses' + this.props._id}/> <DeleteCourseButton handleUpdate = {this.props.handleUpdate}/> </td>
			</tr>
		)
	}
}

export default class CourseTable extends React.Component{

	constructor(props) {
		super(props);
	
		this.updateCourseList = this.updateCourseList.bind(this);

		this.state = {
			courses:[]
		};
	  }

	updateCourseList(){
		axios.get('/api/courses')
			.then((response)=>{
				let courses = response.data.map((c) => {
					return {
						order: c.order,
						name: c.name,
						published: c.published
					}
				});
				this.setState({
					courses: courses
				});
			});
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
       			 </div>
		
				<a className = 'btn btn-primary '>
          		Launch demo modal
        		</a>

    		</div>
		);
	}
}


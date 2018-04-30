import React from 'react';
import NavBar from '../components/NavBar';
//import AcademyButton from '../components/AcademyButton';
import BreadCrumbs from '../components/BreadCrumbs';
import EditCourseTable from '../Components/EditCourseTable';

export default class AdminCourse extends React.Component{

	render(){
		return (
			<div>
				<NavBar activeNavItem={this.props.activeNavItem} />
				<BreadCrumbs breadCrumbs ={this.props.breadCrumbs} />
				<div className="container">
					<div className = "row">
						<div className = "col-md-12">
							<h4><span className="fa fa-graduation-cap" aria-hidden="true"></span> Edit Course: </h4>
							<h1>{this.props.courseTitle}</h1>
							<hr/>
							<div>
							</div>
							<EditCourseTable _id={this.props._id} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
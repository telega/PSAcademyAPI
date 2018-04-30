import React from 'react';
import NavBar from '../components/NavBar';
//import AcademyButton from '../components/AcademyButton';
import BreadCrumbs from '../components/BreadCrumbs';
import CourseTable from '../Components/CourseTable';

export default class AdminCourses extends React.Component{

	render(){
		return (
			<div>
				<NavBar activeNavItem={this.props.activeNavItem} />
				<BreadCrumbs breadCrumbs ={this.props.breadCrumbs} />
				<div className="container">
					<div className = "row">
						<div className = "col-md-12">
							<h1><span className="fa fa-graduation-cap" aria-hidden="true"> </span> Academy Courses</h1>
							<hr/>
							<div>
							</div>

							 <div className = "row">
        						<div className="col-md-12">
           			 				<h2>Courses </h2>
        						</div>
    						</div>

							<CourseTable />
							
						</div>
					</div>
				</div>
			</div>
		);
	}
}

import React from 'react';
import NavBar from '../components/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import EditUnitTable from '../Components/EditUnitTable';
import PropTypes from 'prop-types';

export default class AdminUnit extends React.Component{

	render(){
		return (
			<div>
				<NavBar activeNavItem={this.props.activeNavItem} />
				<BreadCrumbs breadCrumbs ={this.props.breadCrumbs} />
				<div className="container">
					<div className = "row">
						<div className = "col-md-12">
							<h4><span className="fa fa-graduation-cap" aria-hidden="true"></span> Edit Unit: </h4>
							<h1>{this.props.unitTitle}</h1>
						</div>
					</div>
				
					<div className="row">
						<div className = "col-md-12">
							<p>This Unit is part of <strong>{this.props.courseTitle}</strong></p>
							<hr/>
						</div>
					</div>
					<div className = "row">
						<div className = "col-md-12">
							<EditUnitTable courseId={this.props.courseId} 
								unitId={this.props.unitId} 
								courseTitle = {this.props.courseTitle}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


AdminUnit.propTypes = {
	activeNavItem:PropTypes.string,
	breadCrumbs: PropTypes.array,
	unitTitle: PropTypes.string,
	courseTitle: PropTypes.string,
	courseId: PropTypes.string,
	unitId: PropTypes.string,
};

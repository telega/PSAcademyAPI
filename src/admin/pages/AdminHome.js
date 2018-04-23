import React from 'react';
import NavBar from '../components/NavBar';
import AcademyButton from '../components/AcademyButton';
import AdminCard from '../components/AdminCard';

export default class AdminHome extends React.Component{
	render(){
		return (
			<div>
				<NavBar />
				<div className="container">
					<div className = "row">
						<div className = "col-md-12">
							<h1>Academy Admin</h1>
							<div>
							</div>
							<div className = "row">
								<div className="col-md-12">&nbsp;</div>
							</div>
							<div className = "row">
								<AdminCard cardTitle = 'Content' />
								<div className="col-md-4">
									<div className="card">
										<div className="card-header">Settings</div>
										<div className="card-body">
											<div className="card-text">
												<AcademyButton url = "/admin/academy" iconName = 'fa-cogs' title = 'Academy Options' /> 
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="card">
										<div className="card-header">Community</div>
										<div className="card-body">
											<div className='card-text'>
												<AcademyButton url = '/admin/users' iconName = 'fa-users' title = 'Manage Users' />
												<AcademyButton url = '/admin/leaderboard' iconName = 'fa-list' title = 'Academy Leaderboard' />
												<AcademyButton url = '/admin/feedback' iconName = 'fa-comment' title = 'Manage Feedback' />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
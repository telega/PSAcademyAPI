import React from 'react';

export default class NavBar extends React.Component{

	render(){
		return(
			<nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
				<a className="navbar-brand"  href="/admin"><span className="fa fa-graduation-cap" aria-hidden="true"></span></a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className=" navbar-nav mr-auto">
						<li className = "nav-item"><a href="/admin/courses" className = "nav-link <% if(page.activeNavItem == 'Courses'){ %> active <%}%> ">Courses</a></li>
						<li className = "nav-item"><a href="/admin/users" className = "nav-link <% if(page.activeNavItem == 'Users'){ %> active <%}%> ">Users</a></li>
						<li className = "nav-item"><a href="/admin/leaderboard" className = "nav-link <% if(page.activeNavItem == 'Leaderboard'){ %> active <%}%> ">Leaderboard</a></li>
						<li className = "nav-item"><a href="/admin/quizzes" className = "nav-link <% if(page.activeNavItem == 'Quizzes'){ %> active <%}%> ">Quizzes</a></li>
						<li className = "nav-item"><a href="/admin/feedback" className = "nav-link <% if(page.activeNavItem == 'Feedback'){ %> active <%}%> ">Feedback</a></li>
						<li className = "nav-item"><a href="/admin/academy" className = "nav-link <% if(page.activeNavItem == 'Options'){ %> active <%}%> ">Options</a></li>
						<li className = "nav-item"><a href="/admin/glossary" className = "nav-link <% if(page.activeNavItem == 'Glossary'){ %> active <%}%> ">Glossary</a></li>
					</ul>
					<ul className="nav navbar-nav navbar-right">
						<li className = "nav-item"><a href="/logout" className="nav-link">Logout</a></li>
					</ul>
				</div>
			</nav>
		);
	}
}
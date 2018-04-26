import React from 'react';

class NavLink extends React.Component{
	render(){

		if(this.props.activeNavItem == this.props.title){
			return(
				<li className = "nav-item">
					<a href={this.props.url} className = "nav-link active">{this.props.title}</a>
				</li>
			)
		} else {
			return(
				<li className = "nav-item">
					<a href={this.props.url} className = "nav-link">{this.props.title}</a>
				</li>
			)
		}
	}
}

export default class NavBar extends React.Component{

	renderNavItems(){
		return	this.props.navItems.map((navItem)=>{
			return <NavLink url = {navItem.url} title = {navItem.title} activeNavItem = {this.props.activeNavItem} />
		})
	}

	render(){
		return(
			<nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
				<a className="navbar-brand"  href="/admin"><span className="fa fa-graduation-cap" aria-hidden="true"></span></a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className=" navbar-nav mr-auto">
						{this.renderNavItems()}	
					</ul>
					<ul className="nav navbar-nav navbar-right">
						<li className = "nav-item"><a href="/logout" className="nav-link">Logout</a></li>
					</ul>
				</div>
			</nav>
		);
	}
}

NavBar.defaultProps = {
	navItems:[
		{
			url:'/admin/courses',
			title:'Courses'
		},
		{
			url:'/admin/users',
			title:'Users'
		},
		{
			url:'/admin/leaderboard',
			title:'Leaderboard'
		},
		{
			url:'/admin/quizzes',
			title:'Quizzes'
		},
		{
			url:'/admin/feedback',
			title:'Feedback'
		},
		{
			url:'/admin/academy',
			title:'Options'
		},
		{
			url:'/admin/glossary',
			title:'Glossary'
		}
	]
};
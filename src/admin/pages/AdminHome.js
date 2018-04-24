import React from 'react';
import NavBar from '../components/NavBar';
import AcademyButton from '../components/AcademyButton';
import AdminCard from '../components/AdminCard';

export default class AdminHome extends React.Component{

	renderCards(){
		return this.props.cards.map((card, i)=>{
			return	<AdminCard key = {i} cardTitle ={ card.cardTitle } buttons={card.buttons}/>
	})}

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
								{this.renderCards()}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

AdminHome.defaultProps = {

	cards: [
		{ 
		cardTitle:'Content',
		buttons: [
			{
				url:'/admin/courses',
				iconName:'fa-graduation-cap',
				title:'Manage Courses'
			},
			{
				url:'/admin/quizzes' ,
				iconName:'fa-question-circle',
				title:'Manage Quizzes'	
			},
			{
				url:'/admin/glossary',
				iconName:'fa-book',
				title:'Manage Glossary'	
			}
		]},
		{ 
			cardTitle:'Settings',
			buttons: [
				{
					url:'/admin/academy',
					iconName:'fa-cogs',
					title:'Academy Options'
				}
		]},
		{ 
			cardTitle:'Community',
			buttons: [
				{
					url:'/admin/users',
					iconName:'fa-users',
					title:'Manage Users'
				},
				{
					url:'/admin/leaderboard' ,
					iconName:'fa-list',
					title:'Academy Leaderboard'	
				},
				{
					url:'/admin/feedback',
					iconName:'fa-comment',
					title:'Manage Feedback'	
				}
			]}
	]
}
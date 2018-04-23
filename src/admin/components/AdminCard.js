import React from 'react';
import classnames from 'classnames';
import AcademyButton from './AcademyButton';

export default class AdminCard extends React.Component{

	render(){
		return(
			<div className="col-md-4">
				<div className="card">
					<div className="card-header">{this.props.cardTitle}</div>
					<div className="card-body">
						<div className="card-text">
							<AcademyButton url='/admin/courses' iconName='fa-graduation-cap' title='Manage Courses' />
							<AcademyButton url='/admin/quizzes' iconName='fa-question-circle' title= 'Manage Quizzes' />
							<AcademyButton url='/admin/glossary' iconName='fa-book' title= 'Manage Glossary' />
						</div>
					</div>
				</div>
			</div>

		);
	}
}

AdminCard.defaultProps = {
	cardTitle: 'Default'
};
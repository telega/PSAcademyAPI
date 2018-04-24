import React from 'react';
// import classnames from 'classnames';
import AcademyButton from './AcademyButton';

export default class AdminCard extends React.Component{

	renderButtons(){
		return this.props.buttons.map((button, i)=>{
			return	<AcademyButton key = {i} url ={ button.url } title = {button.title} iconName = {button.iconName} />
	})}

	render(){
		return(
			<div className="col-md-4">
				<div className="card">
					<div className="card-header">{this.props.cardTitle}</div>
					<div className="card-body">
						<div className="card-text">
							{this.renderButtons()}
						</div>
					</div>
				</div>
			</div>

		);
	}
}

AdminCard.defaultProps = {
	cardTitle: 'Card Name',
	buttons: []
};
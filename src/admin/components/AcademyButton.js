import React from 'react';
import classnames from 'classnames';

export default class AcademyButton extends React.Component{
	render(){
		return (
			<p>
				<a href={this.props.url} className = "btn btn-primary btn-lg"><span className={classnames('fa',this.props.iconName)} aria-hidden=" true"></span> {this.props.title}</a>
			</p>
		);
	}
}
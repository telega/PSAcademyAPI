import React from 'react';

export default class EditCourseButton extends React.Component{
	render(){
		return (
			<a href={this.props.url} className = "btn btn-secondary"><span className='fa fa-pencil' aria-hidden=" true"></span> Edit</a>
		);
	}
}
import React from 'react';

class BreadCrumb extends React.Component{
	render(){
		if(this.props.isActive == false){
			return(
				<li className = 'breadcrumb-item'><a href={this.props.url}>{this.props.title}</a></li>
			)
		} else {
			return(
				<li className = 'breadcrumb-item active'>{this.props.title}</li>
			)
		}
	}
}

export default class BreadCrumbs extends React.Component{

	renderBreadCrumbs(){
		return this.props.breadCrumbs.map((breadCrumb, i, arr)=>{
			if(i === arr.length-1){
				return	<BreadCrumb key = {i} url ={ breadCrumb.url } title = {breadCrumb.title} isActive = {true} />
			} else {
				return	<BreadCrumb key = {i} url ={ breadCrumb.url } title = {breadCrumb.title} isActive = {false} />
			}
	})}	

	render(){
		return(
			<div className="container">
   				 <div className = 'row'>
        			<div className = "col-md-12">
            			<ol className="breadcrumb">
						{this.renderBreadCrumbs()}
            			</ol>
        			</div>
    			</div>
			</div>
		);
	}
}

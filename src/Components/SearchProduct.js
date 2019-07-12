import React, { Component } from 'react';
export default class SearchProduct extends Component{

    handleChange = (event) => {
        const { onSearchChange } = this.props;
        onSearchChange( event.target.value );
    }

    render(){
        const { placeholder} = this.props;
        let width = '100%';
        return(
            <div className = "search" style={{width:width}}>
                <i className = "search-icon " onClick={()=>this.props.handleIconClick(!this.props.showInput)}></i>
                <input type="text" placeholder = { placeholder } onChange = { this.handleChange }/>
            </div>
        );
    }
}
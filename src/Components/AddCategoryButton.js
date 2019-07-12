import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "../Containers/Styles/CategoryListStyles.css";

export default class AddCategoryButton extends Component {
  render () {
    return <div className="category category--add"
      onClick={(...e) => {
      if (this.props.onAddClick) {
        this.props.onAddClick(...e)
      }
      }}>+</div>
  }
}

AddCategoryButton.propTypes = {
  onAddClick: PropTypes.func
}
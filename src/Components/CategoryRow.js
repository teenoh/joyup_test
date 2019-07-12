import React, {Component} from 'react';
import Category from './Category'
import PropTypes from 'prop-types';

import '../Containers/Styles/CategoryListStyles.css';
import {inject, observer} from "mobx-react/index";

class CategoryRow extends Component {
  constructor (props) {
    super(props)

    this.onCategoryClick = this.onCategoryClick.bind(this)
    this.onEditClick = this.onEditClick.bind(this)
  }

  render () {
    let categories = this.props.categoryList.map((category, index) =>
      <Category
        category={category}
        key={category._id}
        onCategoryClick={(cat) => {
          this.onCategoryClick(cat)
        }}
        onEditClick={this.onEditClick}
      />)
    if (this.props.addButtonToPrevLayout) {
      categories.push(this.props.addButtonToPrevLayout)
    }
    return (
      <div className="category-row">
        {categories}
      </div>
    )
  }

  onEditClick (category) {
    if (this.props.onEditClick) {
      this.props.onEditClick(category)
    }
  }

  onCategoryClick (category) {
    if (this.props.onCategoryClick) {
      this.props.onCategoryClick(category)
    }
    let isSelectedValue = category.isSelected;
    this.props.categoryList.forEach((c) => {
      c.isSelected = false
    });
    if (isSelectedValue) {
      if (category.parentId !== undefined || category.parentId !== null) {
        this.props.categoryListStore.setActiveCategory(category.parentId);
      } else {
        this.props.categoryListStore.setActiveCategory(null);
      }
    } else {
      this.props.categoryListStore.setActiveCategory(category._id);
    }

    category.isSelected = !isSelectedValue || category.isRoot

  }
}
export default inject('categoryListStore', 'categoryUpdateStore', 'navigationStore')(observer(CategoryRow))
CategoryRow.propTypes = {
  categoryList: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onCategoryClick: PropTypes.func,
  addButtonToPrevLayout: PropTypes.node
}
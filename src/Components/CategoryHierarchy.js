import React, {Component} from 'react';
import CategoryRow from './CategoryRow'
import ItemRow from './ItemRow'
import AddCategoryButton from './AddCategoryButton'
import PropTypes from 'prop-types';

export default class CategoryHierarchy extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.onAddCategory = this.onAddCategory.bind(this)
    this.onDeleteItemClick = this.onDeleteItemClick.bind(this)
    this.onEditItemClick = this.onEditItemClick.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
  }

  render () {
    return (
      <div
        style={{flex: 0, flexDirection: 'column'}}
      >
        {this.renderHierarchy(this.props.categoryList)}
      </div>
    )
  }

  renderHierarchy (list, addButtonToPrevLayout = null, currentIndex = 1, itemList = null) {
    let result = []
    if (list && list.length > 0) {
      result.push(
        <CategoryRow
          categoryList={list || []}
          addButtonToPrevLayout={addButtonToPrevLayout}
          key={currentIndex}
          index={currentIndex}
          onCategoryClick={() => {
            if (this.props.onCategoryClick) {
              this.props.onCategoryClick();
            }
          }}
          onEditClick={(category) => {
            if (this.props.onEditCategoryClick) {
              this.props.onEditCategoryClick(category)
            }
          }}
        />
      )
    }
    if (itemList && itemList.length > 0) {
      result.push(
        <ItemRow
          itemList={itemList}
          onDeleteClick={this.onDeleteItemClick}
          onEditClick={this.onEditItemClick}
          addButtonToPrevLayout={addButtonToPrevLayout}
          key={currentIndex}
          onItemClick={this.onItemClick}
        />
      )
    }

    let selectedCategory = null
    if (list && list.length) {
      selectedCategory = list.filter((c) => c.isSelected)
      selectedCategory = selectedCategory.length ? selectedCategory[0] : null
      currentIndex++
      let categoriesOfSelectedCategory = null
      if (!!selectedCategory) {
        categoriesOfSelectedCategory = selectedCategory.categories
        result = result.concat([...this.renderHierarchy(categoriesOfSelectedCategory, <AddCategoryButton
          onAddClick={this.onAddCategory}
          key={++currentIndex}
        />, ++currentIndex, selectedCategory.items)])
      }
    }
    return result
  }

  onAddCategory (...e) {
    if (this.props.onAddCategory) {
      this.props.onAddCategory(...e)
    }
  }
  onItemClick (item) {
    if (this.props.onItemClick) {
      this.props.onItemClick(item)
    }
  }
  onDeleteItemClick (item) {
    if (this.props.onDeleteItemClick) {
      this.props.onDeleteItemClick(item)
    }
  }
  onEditItemClick (item) {
    if (this.props.onEditItemClick) {
      this.props.onEditItemClick(item)
    }
  }
}

CategoryHierarchy.propTypes = {
  categoryList: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onCategoryClick: PropTypes.func,
  onItemClick: PropTypes.func,
  onDeleteItemClick: PropTypes.func,
  onAddCategory: PropTypes.func,
  onEditItemClick: PropTypes.func,
  onEditCategoryClick: PropTypes.func,
}
import React, {Component} from 'react';
import Item from './Item'
import PropTypes from 'prop-types';
import '../Containers/Styles/CategoryListStyles.css';

export default class ItemRow extends Component {
  constructor (props) {
    super(props)

    this.onClick = this.onClick.bind(this)
    this.onEditClick = this.onEditClick.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  render () {
    const {itemList} = this.props
    let items = itemList ? itemList.map((item, index) =>
      <Item
        item={item}
        key={item._id}
        onClick={this.onClick}
        onEditClick={this.onEditClick}
        onDeleteClick={this.onDeleteClick}
      />) : []
    if (this.props.addButtonToPrevLayout) {
      items.push(this.props.addButtonToPrevLayout)
    }
    return (
      <div className="category-row">
        {items}
      </div>
    )
  }

  onEditClick (item) {
    if (this.props.onEditClick) {
      this.props.onEditClick(item)
    }
  }
  onDeleteClick (item) {
    if (this.props.onDeleteClick) {
      this.props.onDeleteClick(item)
    }
  }

  onClick (item) {
    if (this.props.onItemClick) {
      this.props.onItemClick(item)
    }
    let isSelectedValue = item.isSelected;
    this.props.itemList.forEach((i) => {
      i.isSelected = false
    });
    item.isSelected = !isSelectedValue
  }
}

ItemRow.propTypes = {
  itemList: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onItemClick: PropTypes.func,
  onEditItemClick: PropTypes.func,
  onDeleteItemClick: PropTypes.func,
  addButtonToPrevLayout: PropTypes.node
}
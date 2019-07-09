import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../Containers/Styles/CategoryListStyles.css';


export default class Item extends Component {

  constructor (props) {
    super(props)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleEditClick (item) {
    if (this.props.onEditClick) {
      this.props.onEditClick(item)
    }
  }

  handleDeleteClick (item) {
    if (this.props.onDeleteClick) {
      this.props.onDeleteClick(item)
    }
  }

  renderActions () {
    const {item} = this.props;
    if (item.isSelected) {
      return <div className='category__actions'>
        <div key='edit' className='category__actions-label category__actions-edit'
             onClick={() => this.handleEditClick(item)}> EDIT
        </div>
        <div key='delete' className='category__actions-label category__actions-delete'
             onClick={() => this.handleDeleteClick(item)}>DELETE
        </div>
      </div>
    }
  }

  render () {
    const {item} = this.props,
      classes = 'category ' + (item.isSelected ? ' category--selected' : '');
    return (<div style={{minWidth: '10em'}}>
        <div className={classes} onClick={() => {
          if (this.props.onClick) {
            this.props.onClick(item)
          }
        }}
        >
          {`${item.name}`}
        </div>
        {this.renderActions()}
      </div>

    )
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
}
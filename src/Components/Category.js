import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../Containers/Styles/CategoryListStyles.css';
import {observer, inject} from 'mobx-react'


class Category extends Component {

    constructor(props) {
        super(props)
        this.handleEditClick = this.handleEditClick.bind(this)
        this.handleDeleteClick = this.handleDeleteClick.bind(this)
    }

    handleEditClick(category) {
      if (this.props.onEditClick) {
        this.props.onEditClick(category)
      }
    }

    handleDeleteClick(category) {
        if (this.props.onDeleteClick) {
            this.props.onDeleteClick(category)
        }
    }

    renderActions() {
        const {category} = this.props;
        const {activeCategory} = this.props.categoryListStore;
        if (category._id === activeCategory) {//(this.props.actions){
            return <div className='category__actions'>
                <div key='edit' className='category__actions-label category__actions-edit'
                     onClick={() => this.handleEditClick(category)}> EDIT
                </div>
                <div key='delete' className='category__actions-label category__actions-delete'
                     onClick={() => this.handleDeleteClick()}>DELETE
                </div>
            </div>
        }
    }

    render() {
        const {category} = this.props,
            classes = 'category ' + (category.isSelected ? ' category--selected' : '');
        const actions = !category.isRoot ? this.renderActions() : null
        return (<div>
                <div className={classes} onClick={() => {
                    if (this.props.onCategoryClick) {
                        this.props.onCategoryClick(category)
                    }
                }}
                >
                    {`${category.name}`}
                </div>
                {actions}
            </div>

        )
    }
}

export default inject('categoryListStore', 'categoryUpdateStore', 'navigationStore')(observer(Category))
Category.propTypes = {
    category: PropTypes.object,
    onCategoryClick: PropTypes.func,
    onEditClick: PropTypes.func,
}
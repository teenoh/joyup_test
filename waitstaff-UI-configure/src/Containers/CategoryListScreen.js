import React, {Component} from 'react';
import {observer, inject} from 'mobx-react'
import CategoryHierarchy from '../Components/CategoryHierarchy'
import Spinner from '../Components/Spinner'
import Paper from 'material-ui/Paper';
import './Styles/CategoryListStyles.css';
import Config from '../Config/ApiConfig';
import ModalConfirm from '../Components/ModalConfirm';
import CategoryUpdateScreen from './CategoryUpdateScreen';
import ItemUpdateScreen from './ItemUpdateScreen';
import Dialog from 'material-ui/Dialog';

export default inject('categoryListStore', 'categoryUpdateStore', 'navigationStore', 'itemStore')(observer(
  class extends Component {
    constructor (props) {
      super(props);
      this.renderSpinner = this.renderSpinner.bind(this);
      this.renderList = this.renderList.bind(this);
      this.renderRow = this.renderRow.bind(this)
      this.onDeleteItem = this.onDeleteItem.bind(this)
      this.onEditItemClick = this.onEditItemClick.bind(this)
      this.renderUpdateModal = this.renderUpdateModal.bind(this)
      this.onEditCategoryClick = this.onEditCategoryClick.bind(this)

      this.state = {
        openDeleteMessage: false,
        currentItem: null,
        openModal: false,
        updateScreen: null
      }
    }

    componentWillMount () {
      if (!this.props.categoryListStore.categoryList || this.props.categoryListStore.categoryList.length <= 0) {
        //this.props.categoryListStore.setData({squareAndLocationId: '5a00b54b1166db0018f17f77/2EBEQKQ103WMM'});
        this.props.categoryListStore.setData({squareAndLocationId: `${this.props.navigationStore.getMerchantId()}/${this.props.navigationStore.getLocationId()}`});
        this.props.categoryListStore.loadData()
      }
    }

      renderErrorBanner(text) {
          console.log("вызывается renderErrorBanner", text);
          return <div className="categories__wrapper">
                  <div>{text}</div>
              </div>

      }

    render () {
        const categoryList = this.props.categoryListStore.categoryList;
        const loading = this.props.categoryListStore.fetching
      let content ;
        if (loading){
          content  = this.renderSpinner();
        }
        else{
            content = (categoryList.length>0) ? <CategoryHierarchy categoryList={categoryList}
                                         onCategoryClick={(c) => {
                                             this.forceUpdate();
                                         }}
                                         onItemClick={() => {
                                             this.forceUpdate();
                                         }}
                                         onAddCategory={(e) => {
                                             /*e.categories.forEach((c) => {
                                              c.isSelected = false
                                              });
                                              e.indexOfNewCategories = e.indexOfNewCategories ? e.indexOfNewCategories + 1 : 1;
                                              e.categories.push({
                                              id: `${e.id + e.indexOfNewCategories}`,
                                              name: 'new category',
                                              categories: [],
                                              isSelected: true
                                              });
                                              this.forceUpdate()*/
                                         }}
                                         onDeleteItemClick={this.onDeleteItem}
                                         onEditItemClick={this.onEditItemClick}
                                         onEditCategoryClick={this.onEditCategoryClick}
            /> : this.renderErrorBanner();
        }

      const itemName = this.state.currentItem ? this.state.currentItem.name : ''

      return <div className="categories__wrapper">
        <Paper className="categories__title" zDepth={1}>
          <h3>Categories</h3>
        </Paper>
        <Paper className="categories__list" zDepth={1}>
          {content}
        </Paper>
        <ModalConfirm
          isOpen={this.state.openDeleteMessage}
          text={`Do you want to delete the item '${itemName}'`}
          onConfirm={() => {
            this.setState({openDeleteMessage: false})
            if (this.state.currentItem) {
              this.props.itemStore.delete(this.state.currentItem).then((res) => {
                this.props.categoryListStore.loadData()
              })
            }
          }}
          onCancel={() => {
            this.setState({openDeleteMessage: false})
          }}
        />
        {this.renderUpdateModal()}
      </div>;
    }

    renderList (list) {
      return list.map((item, index) => this.renderRow(item, index))
    }

    renderRow (data, index) {
      return <div key={index}>{data.name}</div>
    }

    renderSpinner () {
      return <div className="spinner_wrapper">
          <Spinner/>
      </div>;
    }

    onDeleteItem (item) {
      this.setState({
        openDeleteMessage: true,
        currentItem: item
      })
    }

    onEditItemClick (item) {
      this.props.itemStore.setData(item)
      this.setState(() => {
        return {
          updateScreen: <ItemUpdateScreen
            onClose={() => {
              this.setState({openModal: false})
              return true
            }}
          />,
          openModal: true
        }
      })
      //this.props.navigationStore.changeScreen('itemUpdate')
    }

    onEditCategoryClick (category) {
      this.props.categoryUpdateStore.setCurrentCategory(category);
      this.setState(() => {
        return {
          updateScreen: <CategoryUpdateScreen
            onClose={() => {
              this.setState({openModal: false})
              return true
            }}
          />,
          openModal: true
        }
      })
      //this.props.navigationStore.changeScreen('updateCategory');
    }

    renderUpdateModal () {
      return (
        <Dialog
          contentClassName="contentTable"
          bodyClassName="bodyTable"
          modal={true}
          autoDetectWindowHeight={false}
          autoScrollBodyContent={true}
          open={this.state.openModal}
        >
          {this.state.updateScreen}
        </Dialog>
      )
    }
  }
))
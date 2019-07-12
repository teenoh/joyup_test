import React, {Component} from 'react';
import {observer, inject} from 'mobx-react'
import Spinner from '../Components/Spinner'
import ImageLoader from '../Components/ImageLoader'
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import Config from '../Config/ApiConfig';

import './Styles/CategoryUpdateScreen.css';

export default inject('categoryListStore', 'categoryUpdateStore', 'navigationStore')(observer(
  class extends Component {
    constructor (props) {
      super(props);
      this.renderSpinner = this.renderSpinner.bind(this)
      this.renderList = this.renderList.bind(this)
      this.renderRow = this.renderRow.bind(this)
      this.onItemChecked = this.onItemChecked.bind(this)
    }

    render () {
      const {currentCategory} = this.props.categoryUpdateStore;
      if (currentCategory) {
        let content = currentCategory ? this.renderForm() : this.renderSpinner();
        return <div>
          {this.renderFooter()}
          {content}
          {this.renderEditItems()}
        </div>
      } else {
        return this.renderSpinner();
      }
    }

    renderList (list) {
      return list.map((item, index) => this.renderRow(item, index))
    }

    handleSaveClick () {
      if (this.props.onClose) {
        this.props.onClose()
      }
      const {updateCategory, setCurrentCategory} = this.props.categoryUpdateStore;
      updateCategory();
      this.props.navigationStore.changeScreen('category');
      setCurrentCategory(null);
    }

    handleCancelClick () {
      if (this.props.onClose && this.props.onClose()) return;

      this.props.navigationStore.changeScreen('category');
      this.props.categoryUpdateStore.setCurrentCategory(null)
    }

    renderFooter () {
      return <Paper zDepth={0} className='close_save_row' key='close_save_row'>
        <IconButton style={{padding: '0'}} onClick={() => this.handleCancelClick()}>
          <CloseIcon color='#ddd'/>
        </IconButton>
        <button className='submit_button'
                onClick={() => this.handleSaveClick()}>Save
        </button>
      </Paper>
    }

    renderForm () {
      const {currentCategory, loading, image} = this.props.categoryUpdateStore;
      return <Paper zDepth={0} className="category-update__container" key="update__form-container">
        <div className="image_container" key="image_container">

          <ImageLoader loading={loading} imageUrl={image} callback={(...data) => this.handleInputOnChange(...data)}/>

        </div>
        <div className="input_container" key="input_container">
          <input className="form__field"
                 value={currentCategory.name}
                 placeholder="Category Name"
                 onChange={(e) => this.onChangeFormField('name', e.target.value)}/>
        </div>
      </Paper>
    }

    handleInputOnChange = (file) => {
      this.props.categoryUpdateStore.uploadImage(file, this.props.navigationStore.getMerchantId())
    };

    renderItemsList (allItemsOfSelectedCategory, selfItems) {
      let listItems = [];
      selfItems.forEach((item) => {
        let elem = <ListItem key={item._id}
                             style={{color: 'rgb(28,125,185)'}}
                             primaryText={item.name}
                             leftAvatar={<Avatar src={item.image}/>}
                             rightToggle={<Checkbox defaultChecked={item.in} disabled={item.in && !item.newbie} onCheck={() => {this.onItemChecked(item)}} />}

        />;
        listItems.push(elem);
      });
      allItemsOfSelectedCategory.forEach((item) => {
        if (selfItems.filter((it) => it._id === item._id).length <= 0) {
          let elem = <ListItem key={item._id}
                               style={{color: 'rgb(28,125,185)'}}
                               primaryText={item.name}
                               leftAvatar={<Avatar src={item.image}/>}
                               rightToggle={<Checkbox defaultChecked={item.in} disabled={item.in && !item.newbie} onCheck={() => {this.onItemChecked(item)}} />}

          />;
          listItems.push(elem);
        }
      });

      return <List key='items_list'><Subheader>Assign items to Category </Subheader>{listItems}</List>
    }

    onItemChecked (item) {
      if (!item.in) {
        this.props.categoryUpdateStore.addItemToCategory(item)
      } else {
        this.props.categoryUpdateStore.removeItemFromCategory(item)
      }
      item.in = !item.in
    }

    onChangeFormField (field, value) {
      const {changeCategoryFieldValue} = this.props.categoryUpdateStore;
      changeCategoryFieldValue(field, value);
    }

    renderRow (data, index) {
      return <div key={index}>{data.name}</div>
    }

    renderShowEditItemsButton () {
      const {showEditItems, changeShowEditItems} = this.props.categoryUpdateStore;
      const text = showEditItems ? "OK" : "Edit items";
      return <button className='submit_button' onClick={() => changeShowEditItems()}>{text}</button>
    }

    renderEditItems () {
      const {currentCategory} = this.props.categoryUpdateStore;
      const {selectedCategory, getAllCategories} = this.props.categoryListStore;
      let allItemsOfSelectedCategory = [];
      getAllCategories(selectedCategory).forEach((c) => {
        if (c.items && c._id !== currentCategory._id) {
          c.items.forEach((item) => {
            allItemsOfSelectedCategory.push(item)
          })
        }
      });
      allItemsOfSelectedCategory.map((item) => {
        item.in = false;
        return item
      });
      let selfItems = currentCategory.items;
      selfItems.map((item) => {
        item.in = true;
        return item
      });
      // let items = allItemsOfSelectedCategory.concat(selfItems);
      // let content = this.renderShowEditItemsButton();
      let itemsList = <Paper zDepth={0} className="category-update__container" style={{margin: '0 0.5em'}}
                             key="update__form-container">
          {this.renderItemsList(allItemsOfSelectedCategory, selfItems)}
        </Paper>
      ;
      return <div key="itemsList">{itemsList}</div>


    }

    // handleOnCheck(checked, item) {
    //     const {removeItemFromCategory, addItemToCategory} = this.props.categoryUpdateStore;
    //     console.log("handleOnCheck(checked, item---->>>>>", checked, item);
    // }

    renderSpinner () {
      return <div key='spinner'><Spinner/></div>;
    }
  }
))
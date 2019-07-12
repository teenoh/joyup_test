import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react'
import Spinner from '../Components/Spinner'
import NavigationStore from '../Stores/NavigationStore'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import './Styles/ItemUpdateScreen.css';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import Checkbox from 'material-ui/Checkbox';
import ImageLoader from '../Components/ImageLoader'
import Config from "../Config/ApiConfig";
import IconButton from 'material-ui/IconButton';

class ItemUpdateScreen extends Component {
  constructor (props) {
    super(props);
    this.renderSpinner = this.renderSpinner.bind(this)
    this.renderList = this.renderList.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  render () {
    const {item, image} = this.props.itemStore;
    let content = !this.props.categoryListStore.fetching && !this.props.itemStore.fetching ? this.renderForm(item, image) : this.renderSpinner();
    return <div className="categories__wrapper">
      {content}
    </div>
  }

  renderList (list) {
    return list.map((item, index) => this.renderRow(item, index))
  }

  renderFooter () {
    return <Paper zDepth={0} className='close_save_row' key='close_save_row'>
      <IconButton style={{padding: '0'}} onClick={this.onCancel}>
        <CloseIcon color='#ddd'/>
      </IconButton>
      <button className='submit_button'
              onClick={this.onSave}>Save
      </button>
    </Paper>
  }

  renderForm (item, image) {
    return (
      <div>
        {this.renderFooter()}
        <Paper zDepth={0} className="item-update__container" key="update__form-container">
          <div className="image_container">
            <div>
              <ImageLoader loading={this.props.itemStore.loading} imageUrl={image}
                           callback={(...data) => this.handleInputOnChange(...data)}/>
            </div>
          </div>
          <div className="input_container">
            <input className="form__field"
                   value={item.name || ''}
                   placeholder="Item Name"
                   onChange={(e) => {
                     item.name = e.target.value
                   }}/>
          </div>
          <div className="input_container">
            <input className="form__field"
                   value={item.price || ''}
                   placeholder="Price"
                   onChange={(e) => {
                     item.price = e.target.value
                   }}/>
          </div>

          <div className="input_container">
            <input className="form__field"
                   value={item.description || ''}
                   placeholder="Description"
                   onChange={(e) => {
                     item.description = e.target.value
                   }}/>
          </div>
          <div className="input_container">
            <input className="form__field"
                   value={item.title || ''}
                   placeholder="Title"
                   onChange={(e) => {
                     item.title = e.target.value
                   }}/>
          </div>
          <div className="input_container">
            <input className="form__field"
                   value={item.prep_time || ''}
                   placeholder="Preparation time in minutes"
                   onChange={(e) => {
                     item.prep_time = e.target.value
                   }}/>
          </div>
          <div className="input_container">
            <input className="form__field"
                   value={item.taxes || ''}
                   placeholder="Taxes"
                   onChange={(e) => {
                     item.taxes = e.target.value
                   }}/>
          </div>
          <div className="input_container">
            <div className="is_active_container">
              <label>Is active</label>
              <Checkbox
                defaultChecked={item.active}
                onCheck={(e) => {
                  item.active = e.target.checked
                }}
                style={{width: undefined}}
              />
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  renderRow (data, index) {
    return <div key={index}>{data.name}</div>
  }

  renderSpinner () {
    return <div><Spinner/></div>;
  }

  onCancel () {
    if (!(this.props.onClose && this.props.onClose())) {
      this.props.itemStore.setData(null)
      NavigationStore.changeScreen(NavigationStore.prevScreenName || 'category')
    }
  }

  handleInputOnChange = (file) => {
    this.props.itemStore.uploadImage(file, this.props.navigationStore.getMerchantId())//Config.merchantId)
  };

  onSave () {
    this.props.itemStore.save().then((res) => {
      if (!(this.props.onClose && this.props.onClose())) {
        NavigationStore.changeScreen(NavigationStore.prevScreenName || 'category');
        this.props.itemStore.setData(null);
      }
    })
  }
}

export default inject('categoryListStore', 'itemStore', 'navigationStore')(observer(ItemUpdateScreen))

ItemUpdateScreen.propTypes = {
  onClose: PropTypes.func
}

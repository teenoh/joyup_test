import {extendObservable, action} from 'mobx'
import api from '../Services/Api'
import CategoryListStore from './CategoryListStore'

class ItemStore {
  constructor () {
    extendObservable(this, {
      loading:false,
      fetching: false,
      _id: '',
      id: '',
      name: '',
      location: '',
      description: '',
      title: '',
      image: '',
      price: 0,
      prep_time:0,
      taxes: 0,
      active: false,
      options: [],
      modifiers: [],
      createdAt: new Date(),

        item: null,

      setData: action((item) => {
        this._id = item ? item._id : null
        this.id = item ? item.id : null
        this.name = item ? item.name : ''
        this.location = item ? item.location : ''
        this.description = item ? item.description : ''
        this.title = item ? item.title : ''
        this.image = item ? item.image : ''
        this.price = item ? item.price : 0
        this.taxes = item ? item.taxes : 0
        this.prep_time = item ? item.prep_time : 5
        this.active = item ? item.active : false
        this.options = item ? item.options : []
        this.modifiers = item ? item.modifiers : []
        this.createdAt = item ? item.createdAt : null
            this.item = item
      })
    })
  }

  save (squareAndLocationId = null) {
    this.fetching = true;
    this.item.image = this.image;
    squareAndLocationId = squareAndLocationId || CategoryListStore.squareAndLocationId
    return api.saveItem(squareAndLocationId, this.item).then((res) => {
      return res
    }).catch((ex) => {
      console.error(ex, 'error in save of itemStore')
    }).then((res) => {
      this.fetching = false
      return res
    })
  }

    uploadImage=action((file, merchantId)=>{
        this.loading = true;
        api.uploadImage(file, merchantId).then((res)=>{ this.loading = false;  this.handleImageRes(res)});
    });

    handleImageRes=action((res)=>{
        if(res.url){
            this.image = res.url;
        }
    });
  delete (item = null) {
    this.fetching = true
    return api.deleteItem(item || this).then((res) => {
      return res
    }).catch((ex) => {
      console.error(ex, 'error in save of itemStore')
    }).then((res) => {
      this.fetching = false
      this.setData(null)
      return res
    })
  }
}
export default new ItemStore()


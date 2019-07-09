import {extendObservable, action} from 'mobx'
import api from '../Services/Api'
import Config from '../Config/ApiConfig';
import ItemStore from './ItemStore';
import CategoryListStore from './CategoryListStore';
import NavigationStore from './NavigationStore'

class CategoryUpdateStore {
  constructor () {
    extendObservable(this, {
      loading: false,
      currentCategory: null,
      showEditItems: false,
      image: '',
      items: [],
      deleteCategory: action((category) => {
        this.fetching = true;
        return api.deleteCategory(category).then((res) => {
          let tempList = this.deleteCategoryFromTree(this.categoryList);
          this.setData({categoryList: tempList})
        }).catch((ex) => {
          this.fetching = false
        }).then((res) => {
          this.fetching = false
        })
      })
    })
  }

  removeItemFromCategory = action((item) => {
    this.currentCategory.items = this.currentCategory.items.filter((i) => i._id !== item._id);
  });
  addItemToCategory = action((item) => {
    item.newbie = true
    this.currentCategory.items.push(item);
  });

  uploadImage = action((file, merchantId) => {
    this.loading = true;
    api.uploadImage(file, merchantId).then((res) => {
      this.handleImageRes(res);
      this.loading = false;
    });
  });

  handleImageRes = action((res) => {
    if (res.url) {
      this.image = res.url;
    }
  });
  getUniqueFilename = (config) => {
    let timestamp = (new Date()).getTime();
    let randomInteger = Math.floor((Math.random() * 1000000) + 1);

    return config.aws.path + timestamp + '_' + randomInteger + '.png';
  };
  setCurrentCategory = action((object) => {
    this.currentCategory = object;
    if (object) this.image = (!!object.image_url ? object.image_url : '');
  });
  changeCategoryFieldValue = action((field, value) => {
    this.currentCategory[field] = value;
  });
  changeShowEditItems = action(() => this.showEditItems = !this.showEditItems);
  updateCategory = action(() => {
    if (this.currentCategory) {
      let newbieItemList = this.currentCategory.items.filter((item) => item.newbie)
      const currentCategory = this.currentCategory
      newbieItemList.reduce(
        (p, newbie) => p.then(
          () => new Promise(
            (resolve, reject) => {
              CategoryListStore.removeItemFromCategories(newbie, currentCategory._id).then(() => {
                resolve()
              }).catch((ex) => {
                reject()
              })
            }
          )
        ).catch((ex) => {
          Promise.reject()
        }),
        Promise.resolve()
      ).then(() => {
        currentCategory.image_url = this.image;
        api.saveCategory(`${NavigationStore.getMerchantId()}/${NavigationStore.getLocationId()}`, currentCategory).then((res) => {
          CategoryListStore.loadData()
        })
      }).catch((ex) => {
        console.log(ex, 'ERROR')
      })
    }

  });

  validatingData () {

  }

}

export default new CategoryUpdateStore();


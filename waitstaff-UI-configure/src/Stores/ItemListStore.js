import {extendObservable} from 'mobx'
class CategoryListStore {
  constructor () {
    extendObservable(this, {
      itemsForDisplaying: []
    })
  }
}
export default new CategoryListStore()


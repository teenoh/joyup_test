import apisauce from 'apisauce'
import apiConfig from '../Config/ApiConfig'
import NavigationStore from '../Stores/NavigationStore'

class Api {
  // response codes
  baseURL = apiConfig.baseURL
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL: this.baseURL,
    // here are some default headers
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
      'Content-Type': 'application/json'
    },
    // 10 second timeout...
    timeout: 45000
  })

  getAllCategories (squareAndLocationId) {
    return this.api.get(`menu/square/${squareAndLocationId}`)
  }

  getImages (imgUrl) {
    return this.api.get(`menu/image/${imgUrl}`)
  }

  saveCategory (squareAndLocationId, category) {
    return this.api.post(`menu/square/${squareAndLocationId}`, {
      type: 'CATEGORY',
      _id: category._id,
      id: category.id,
      name: category.name,
      image_url: category.image_url,
      active: category.active,
      items: category.items,
      created_at: category.createdAt,
      parentId: category.parentCategory
    })
  }

  deleteCategory (category) {
    return this.api.delete(`menu/category/${category._id}`, {type: "CATEGORY"})
  }

  getAllItems (squareAndLocationId, categoryId = null) {
    let request = `menu/category/${squareAndLocationId}/get/` + (categoryId ? categoryId : '');
    return this.api.get(request)
  }

  saveItem (squareAndLocationId, item) {
    return this.api.post(`menu/square/${squareAndLocationId}`, {
      type: 'ITEM',
      _id: item._id,
      id: item.id,
      name: item.name,
      location: item.location,
      description: item.description,
      title: item.title,
      image: item.image,
      price: item.price,
      taxes: item.taxes,
      active: item.active,
      options: item.options,
      modifiers: item.modifiers,
      created_at: item.createdAt
    })
  }

  uploadImage (file, merchantId) {
    const data = new FormData();
    data.append('payload', file);
    data.append('fileName', file.name);
    data.append('merchantId', merchantId);

    return fetch(`https://waitstaff.joyup.me/menu/image`, {
      method: 'POST',
      body: data
    }).then(
      response => response.json()
    ).then(
      success => success
    ).catch(
      error => console.log(error)
    )
  }

  deleteItem (item) {
    return this.api.delete(`menu/item/${item._id}`, {type: "ITEM"})
  }


  /**
   * Get the greeting message for configuation page
   * 
   */

  uploadImageHeroImage (file) {
    const data = new FormData();
    data.append('payload', file);
    data.append('fileName', file.name);
    data.append('merchantId', NavigationStore.getMerchantId());
    return fetch(`https://waitstaff.joyup.me/menu/image`, {
      method: 'POST',
      body: data
    })
  }

  getGreetingMessage() {
    return this.api.get(`prod?apiKey=${apiConfig.apiKey}&q={"merchant_uid":"${NavigationStore.getMerchantId()}"}`)
  }

  saveGreetingMessage(option){
    console.log(">>savegreeting",option)
    let data = {
      "$set": {
        merchant_uid: NavigationStore.getMerchantId(),
        page_hero_image: option.page_hero_image,
        page_welcome_text: option.page_welcome_text,
        page_welcome_action_button: option.page_welcome_action_button
      }
    }
    return this.api.put(`prod?apiKey=${apiConfig.apiKey}&q={"merchant_uid":"${NavigationStore.getMerchantId()}"}`,data)
  }

  /**
   *  Get Business Timezone
   * 
   */
  getBusinessTimeZone(){
    return this.api.get(`prod?apiKey=${apiConfig.apiKey}&q={"merchant_uid":"${NavigationStore.getMerchantId()}"}`)
  }
  saveTimeZone(option){
    let data = {
      "$set": {
        merchant_uid: NavigationStore.getMerchantId(),
        hours_of_operation: option.hours_of_operation,
        time_zone: option.time_zone
      }
    }
    return this.api.put(`prod?apiKey=${apiConfig.apiKey}&q={"merchant_uid":"${NavigationStore.getMerchantId()}"}&u=true`, data)
  }
  saveOrderMessage(option){
    let data = {
      "$set": {
        merchant_uid: NavigationStore.getMerchantId(),
        page_confirmation_text: option.page_confirmation_text,
        page_confirmation_button: option.page_confirmation_button
      }
    }
    return this.api.put(`prod?apiKey=${apiConfig.apiKey}&q={"merchant_uid":"${NavigationStore.getMerchantId()}"}&u=true`,data)
  }
   
}
 
export default new Api()

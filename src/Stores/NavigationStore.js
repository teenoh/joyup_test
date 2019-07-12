import React from 'react';
import {extendObservable, action} from 'mobx'
import CategoryListScreen from '../Containers/CategoryListScreen';
import ItemListScreen from '../Containers/ItemListScreen';
import CategoryUpdateScreen from '../Containers/CategoryUpdateScreen';
import ItemUpdateScreen from '../Containers/ItemUpdateScreen';
import Configure from '../Containers/Configure'
import Dashboard from '../Containers/DashboardScreen'
import ApiConfig from '../Config/ApiConfig';

const Views = {
    category:<CategoryListScreen/>,
    updateCategory:<CategoryUpdateScreen/>,
    item:<ItemListScreen/>,
    itemUpdate: <ItemUpdateScreen/>,
    configure: <Configure/>,
    dashboard: <Dashboard />,
};

class NavigationStore {
  constructor () {
    extendObservable(this, {
      activeScreen: Views.dashboard,
      currScreenName: 'dashboard',
      prevScreenName: '',
      isOpenMenu:false,
      changeScreen:action((screenName, prevScreenName = null) => {
        this.prevScreenName = prevScreenName
          const newScreen = Views[screenName];
          if (newScreen) {
             this.isOpenMenu = false;
             this.currScreenName = screenName
             this.activeScreen = newScreen;

          }
      }),
      openMenu:action(() => {
            this.isOpenMenu = true;
      }),
      closeMenu:action(() => {
          this.isOpenMenu = false;
      }),
        targetView: action((name)=>{
            let unit =this.getCookieByName(name)
            if(unit==='categories'){
                return Views.category;
            }else {
                return Views.item
            }
        }),
    })
  }
  getMerchantId=()=>{
      const merchantId = this.getCookieByName('merchantId');
      const hardMerchantId =ApiConfig.merchantId;
      console.log("====merchantId=====", (merchantId ? merchantId : hardMerchantId));
      return merchantId ? merchantId : hardMerchantId;
  };
  getLocationId=()=>{
      const locationId = this.getCookieByName('locationId');
      const hardLocationId = ApiConfig.locationId;
      console.log('=====locationId======', (locationId? locationId : hardLocationId));
      return locationId? locationId : hardLocationId;

  };

  getCookieByName=(name)=>{
      let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? matches[1] : undefined;
  }
}


export default new NavigationStore();


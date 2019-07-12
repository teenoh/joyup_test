import {extendObservable, action, observable} from 'mobx'
import api from '../Services/Api'
import apiConfig from '../Config/ApiConfig'
import NavigationStore from "./NavigationStore";

class CategoryListStore {
  constructor () {
    extendObservable(this, {
      fetching: false,
      categoryList: observable.deep([]),
      squareAndLocationId: '',
      activeCategory: null,
      setData: action((data) => {
        this.squareAndLocationId = data.squareAndLocationId !== undefined ? data.squareAndLocationId : this.squareAndLocationId
        this.categoryList = data.categoryList !== undefined ? data.categoryList : this.categoryList

        if (!!this.categoryList) {
          if (this.categoryList[0]) {
            this.activeCategory = this.categoryList[0]._id;
          }

          let tempAllCategories = []
          this.categoryList.forEach((c) => {
            let temp = this.getAllCategories(c)
            if (temp.length) {
              tempAllCategories = tempAllCategories.concat(temp)
            }
          })
          let allProductsCategory = {
            name: 'All Products',
            categories: this.categoryList,
            items: [],
            createdAt: new Date(),
            index: 0
          }
          this.allCategories = [allProductsCategory, ...tempAllCategories].filter(c => c.name !== "Menu").map((c, index) => ({
            ...c,
            index
          }))
          this.selectedCategory = this.allCategories[0];
          ;
        }
      }),
      selectedCategory: null,
      allCategories: [],
      getAllCategories: (category, currentDepth = 0) => {
        let result = [{
          ...category,
          depth: currentDepth
        }]
        if (category && category.categories) {
          category.categories.forEach((c) => {
            result = result.concat(this.getAllCategories(c, currentDepth + 1))
          })
        }
        return result
      },
      deleteCategory: action((category) => {
        this.fetching = true
        return api.deleteCategory(category).then((res) => {
          let tempList = this.deleteCategoryFromTree(this.categoryList)
          this.setData({categoryList: tempList})
        }).catch((ex) => {
          this.fetching = false
        }).then((res) => {
          this.fetching = false
        })
      }),
      removeItemFromCategories: action((item, exceptForCategoryId) => {
        this.fetching = true
        let categoriesWithItem = this.allCategories.filter((category) =>
          (category._id !== exceptForCategoryId || !exceptForCategoryId) &&
          category.items &&
          category.items.filter((i) => i._id === item._id).length > 0
        )
        categoriesWithItem.forEach((category) => {
          category.items = category.items.filter((i) => i._id !== item._id)
          //api.saveCategory(category)
        })

        return categoriesWithItem.reduce(
          (p, cat) => p.then(
            () => new Promise(
              (resolve, reject) => {
                api.saveCategory(`${NavigationStore.getMerchantId()}/${NavigationStore.getLocationId()}`, cat).then((res) => {
                  resolve(res)
                }).catch((ex) => {
                  reject()
                })
              }
            )
          ).catch((ex) => {
            Promise.reject()
          }),
          Promise.resolve().then(() => {
            this.fetching = false
          })
        )

      })
    })
  }

  deleteCategoryFromTree (category, node) {
    return node//.categories ? node.categories.filter((c) => c!== category) : []
  }

  setActiveCategory = action((id) => {
    this.activeCategory = id
  });

  loadData () {
    this.fetching = true;
    /*return new Promise((resolve)=>{
     this.setData({
     categoryList: this.dataNormalize([{
     _id: 0,
     name: 'Menu',
     categories: this.getFakeData2().menu
     }], 0)
     })
     resolve()
     })*/
    return api.getAllCategories(this.squareAndLocationId).then((response) => {
      if (response.ok && response.data) {
        this.setData({
          categoryList: this.dataNormalize([{
            isRoot: true,
            _id: 0,
            name: 'Menu',
            categories: response.data.menu
          }], 0)
        })
      }
    }).catch((ex) => {
      this.fetching = false
    }).then(() => {
      this.fetching = false
    })
  }

  dataNormalize (data, depth, parentId = null) {
    return data.map((row, index) => this.singleDataNormalize(row, index, depth, parentId))
  }

  singleDataNormalize (data, index, depth, parentId = null) {
    const categories = data.categories ? this.dataNormalize(data.categories, depth + 1, data._id) : []
    let normalizedData = null
    if (!!data) {
      normalizedData = {
        ...data,
        createdAt: data.created_at,
        merchantId: data.merchant_id,
        items: this.itemsNormalize(data.items),
        categories: categories,
        isSelected: index === 0 && depth === 0,
        parentId
      }
    }
    return normalizedData
  }

  itemsNormalize (data) {
    return data ? data.map((row) => this.singleItemNormalize(row)) : []
  }

  singleItemNormalize (row) {
    return {
      ...row,
      createdAt: row.created_at
    }
  }

  update = action((obj) => {
    this.categoryList.map((item) => item._id === obj._id ? obj : item);
  });

  getFakeData () {
    return [
      {
        isSelected: true,
        createdAt: new Date(),
        id: "ITEM",
        _id: "ITEM",
        items: [
          {
            active: true,
            created_at: new Date(),
            description: null,
            id: "WDKRVSGOUUFDFHMXJZLIKLB5",
            image: "https://agmashop.ru/pictures/product/big/47258_big.jpg",
            modifiers: [],
            name: "OGGGGG",
            options: [{
              id: "MCRK2YA6K5JA3G2DMOWGHNRT",
              name: "Regular",
              price: 10
            }],
            price: 10,
            taxes: 0,
            title: "",
            __v: 0,
            _id: "5a5e6a76d928509132ec5401"
          }
        ],
        name: "Main",
        categories: [
          {
            isSelected: false,
            createdAt: new Date(),
            id: "FF",
            _id: "FF",
            parentId: "ITEM",
            items: [
              {
                active: true,
                created_at: new Date(),
                description: null,
                id: "WDKRVSGOUUFDFHMXJZLIKLB5",
                image: "https://www.onlinetrade.ru/img/items/m/sross_pad_dlya_mishi_cpf_037_yagodi__1.jpg",
                modifiers: [],
                name: "Double OGGGGG",
                options: [{
                  id: "MCRK2YA6K5JA3G2DMOWGHNRT",
                  name: "Regular",
                  price: 20
                }],
                price: 30,
                taxes: 0,
                title: "",
                __v: 0,
                _id: "5a5e6a76d928509132ec5401"
              },
              {
                active: true,
                created_at: new Date(),
                description: null,
                id: "WDKRVSGOUUFDFHMXJZLIKLB6",
                image: "https://www.spr.ru/price_img/2016-03/756299.jpg",
                modifiers: [],
                name: "Double OG2",
                options: [{
                  id: "MCRK2YA6K5JA3G2DMOWGHNRT1",
                  name: "Regular",
                  price: 20
                }],
                price: 33,
                taxes: 0,
                title: "",
                __v: 0,
                _id: "5a5e6a76d928509132ec54011"
              }
            ],
            name: "Fast Food",
            categories: [
              {
                isSelected: false,
                createdAt: new Date(),
                id: "BRG",
                _id: "BRG",
                parentId: "FF",
                items: [],
                name: "Burger",
                categories: [
                  {
                    isSelected: false,
                    parentId: "BRG",
                    createdAt: new Date(),
                    id: "HMB",
                    _id: "HMB",
                    items: [],
                    name: "Hamburger",
                    categories: []
                  },
                  {
                    isSelected: false,
                    parentIde: "BRG",
                    createdAt: new Date(),
                    id: "CHEEESB",
                    _id: "CHEEESB",
                    items: [],
                    name: "Cheesburger",
                    categories: []
                  },
                  {
                    isSelected: false,
                    parentId: "BRG",
                    createdAt: new Date(),
                    id: "SMAMB",
                    _id: "SMAMB",
                    items: [],
                    name: "Slamburger",
                    categories: []
                  },
                ]
              },
              {
                isSelected: false,
                createdAt: new Date(),
                id: "PIZZA",
                _id: "PIZZA",
                parentId: "FF",
                items: [],
                name: "Pizza",
                categories: []
              },
              {
                isSelected: false,
                createdAt: new Date(),
                id: "PASTA",
                _id: "PASTA",
                parentId: "FF",
                items: [],
                name: "Pasta",
                categories: []
              },
              {
                isSelected: false,
                createdAt: new Date(),
                parentId: "FF",
                id: "MF",
                _id: "MF",
                items: [],
                name: "Muffin",
                categories: []
              },
              {
                isSelected: false,
                createdAt: new Date(),
                parentId: "FF",
                id: "SANDW",
                _id: "SANDW",
                items: [],
                name: "Sandwich",
                categories: []
              }
            ]
          },
          {
            isSelected: false,
            createdAt: new Date(),
            parentId: "ITEM",
            id: "DRINKS",
            _id: "DRINKS",
            items: [
              {
                active: true,
                created_at: new Date(),
                description: null,
                id: "WDKRVSGOUUFDFHMXJZLIKLB3",
                image: "https://i1.wallpaperscraft.com/image/wine_dinner_turkey_potatoes_bacon_carrots_43841_300x300.jpg",
                modifiers: [],
                name: "Triple OGGGGG",
                options: [{
                  id: "MCRK2YA6K5JA3G2DMOWGHNRT",
                  name: "Regular",
                  price: 20
                }],
                price: 20,
                taxes: 0,
                title: "",
                __v: 0,
                _id: "5a5e6a76d928509132ec5401"
              },
              {
                active: true,
                created_at: new Date(),
                description: null,
                id: "WDKRVSGOUUFDFHMXJZLIKLB4",
                image: "",
                modifiers: [],
                name: "Triple OG2",
                options: [{
                  id: "MCRK2YA6K5JA3G2DMOWGHNRT1",
                  name: "Regular",
                  price: 20
                }],
                price: 20,
                taxes: 0,
                title: "",
                __v: 0,
                _id: "5a5e6a76d928509132ec54011"
              }
            ],
            name: "Drinks",
            categories: []
          }
        ]
      }]

  };

  getFakeData2 () {
    let obj = {
      "_id": "5a5e6a76d928509132ec4fe2",
      "merchant_id": "5a00b54b1166db0018f17f77",
      "menu": [
        {
          "_id": "5a694be40c950d919931efee",
          "merchant_id": "5a00b54b1166db0018f17f77",
          "name": "!___!",
          "id": "somecategoryid123",
          "active": true,
          "__v": 0,
          "image_url": "test.jpeg",
          "parentId": null,
          "created_at": "2018-03-03T16:57:33.662Z",
          "items": null
        },
        {
          "_id": "5a694bfb0c950d919931f21d",
          "merchant_id": "5a00b54b1166db0018f17f77",
          "name": "ITEM",
          "id": "ITEM",
          "active": true,
          "__v": 0,
          "parentId": null,
          "created_at": "2018-03-05T15:26:42.354Z",
          "items": [
            {
              "_id": "5a5e6a76d928509132ec53ed",
              "id": "5a5e6a76d928509132ec53ed",
              "name": "!__|__!",
              "title": "title !!!",
              "image": "http://xochu-vse-znat.ru/wp-content/uploads/2016/09/mini-test.jpg",
              "price": 1,
              "taxes": 1,
              "active": true,
              "__v": 0,
              "description": "description !!!",
              "location": "2EBEQKQ103WMM",
              "created_at": "2018-03-05T14:29:33.533Z",
              "modifiers": [],
              "options": []
            },
            {
              "_id": "5a5e6a76d928509132ec53ee",
              "id": "PCOLKJ5774BLF2IGVSFORYGI",
              "name": "Berry White",
              "title": "",
              "image": "",
              "price": 8.5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "OBSPXCUOK4C2NUGAE5ADYCSW",
                  "name": "Regular Price",
                  "price": 8.5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec53ef",
              "id": "6KCPMPHOJLGORC6FMVE6WMVG",
              "name": "Al Greens",
              "title": "",
              "image": "",
              "price": 9.5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "KSEGJDAL3K4ZIT5PDXGKC6FO",
                  "name": "Regular Price",
                  "price": 9.5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec5406",
              "id": "XBW6AH3HPAZO2P36BGDVOM7J",
              "name": "Bowld Tank",
              "title": "",
              "image": "",
              "price": 20,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "3SL4MPP6DJPQNNMZ2ISK7OIN",
                  "name": "Regular Price",
                  "price": 20
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec53f0",
              "id": "S7UPRBWH2A6V2TSKYNG7R72D",
              "name": "Flu Shot 2",
              "title": "",
              "image": "",
              "price": 5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "5SJPVYAYP6LCKXXKPG4FVU44",
                  "name": "Regular Price",
                  "price": 5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec5425",
              "id": "VDDM7LIYPSOLQBY3GOT7IAKY",
              "name": "Protein ",
              "title": "",
              "image": "",
              "price": 2,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "2KLLN3DNBEZ2BDGGIGMOSY5O",
                  "name": "Regular Price",
                  "price": 2
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec53f2",
              "id": "R2VOAFLDUZI23C35GHTH4JQQ",
              "name": "Beast Mode",
              "title": "",
              "image": "",
              "price": 10.5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "HI2GUUTCDGOMQ45U4DD6BL43",
                  "name": "Regular Price",
                  "price": 10.5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec540b",
              "id": "UY7EWFA4NIV72KDO43ROI64A",
              "name": "OG Reg",
              "title": "",
              "image": "",
              "price": 10.5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "BJKK7C7LCS6PZOMY6PA3MTOB",
                  "name": "Regular Price",
                  "price": 10.5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec540a",
              "id": "RSLLXPXANDEHGE37ORMMCVD5",
              "name": "OG Large",
              "title": "",
              "image": "",
              "price": 14.5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "GNR6K6D6OB6F3L7ULY7J5ITO",
                  "name": "Regular Price",
                  "price": 14.5
                }
              ]
            },
            {
              "_id": "5a9c90080c950d9199d4ea52",
              "id": "M2W4EZHIATFZV3NUEU7X2XEF",
              "__v": 0,
              "name": "Power Up $1",
              "title": "",
              "description": null,
              "image": "",
              "price": 1,
              "taxes": 8.75,
              "active": true,
              "created_at": "2018-03-05T00:31:54.525Z",
              "modifiers": [],
              "options": [
                {
                  "id": "SGXUF5CGXDLLP3G43EPVWFPP",
                  "name": "Regular Price",
                  "price": 1
                }
              ]
            }
          ]
        },
        {
          "_id": "5a694c160c950d919931f48a",
          "merchant_id": "5a00b54b1166db0018f17f77",
          "name": "SMOOTHIES",
          "id": "ITEM",
          "active": true,
          "__v": 0,
          "parentId": null,
          "created_at": "2018-03-05T15:26:42.354Z",
          "items": [
            {
              "_id": "5a5e6a76d928509132ec53ee",
              "id": "PCOLKJ5774BLF2IGVSFORYGI",
              "name": "Berry White",
              "title": "",
              "image": "",
              "price": 8.5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "OBSPXCUOK4C2NUGAE5ADYCSW",
                  "name": "Regular Price",
                  "price": 8.5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec53f2",
              "id": "R2VOAFLDUZI23C35GHTH4JQQ",
              "name": "Beast Mode",
              "title": "",
              "image": "",
              "price": 10.5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "HI2GUUTCDGOMQ45U4DD6BL43",
                  "name": "Regular Price",
                  "price": 10.5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec53f9",
              "id": "BGM7TSEVOGMNMUV2CWVT3VH2",
              "name": "Hella Green",
              "title": "",
              "image": "",
              "price": 8.5,
              "taxes": 0,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "YA5BSO6KTPHSWWDF3TBTS4RM",
                  "name": "Regular",
                  "price": 8.5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec53fa",
              "id": "CGJ5TTAVNIMTTG4WYROFIMIG",
              "name": "Rocket Fuel",
              "title": "",
              "image": "",
              "price": 10.5,
              "taxes": 0,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "Q2PDEEKWY4YDA3ZOHDEHGIUT",
                  "name": "Regular",
                  "price": 10.5
                }
              ]
            }
          ]
        },
        {
          "_id": "5a694c2a0c950d919931f66d",
          "merchant_id": "5a00b54b1166db0018f17f77",
          "name": "JUICES",
          "id": "ITEM",
          "active": true,
          "__v": 0,
          "parentId": null,
          "created_at": "2018-03-05T15:26:42.354Z",
          "items": [
            {
              "_id": "5a5e6a76d928509132ec53ed",
              "id": "5a5e6a76d928509132ec53ed",
              "name": "!__|__!",
              "title": "title !!!",
              "image": "http://xochu-vse-znat.ru/wp-content/uploads/2016/09/mini-test.jpg",
              "price": 1,
              "taxes": 1,
              "active": true,
              "__v": 0,
              "description": "description !!!",
              "location": "2EBEQKQ103WMM",
              "created_at": "2018-03-05T14:29:33.533Z",
              "modifiers": [],
              "options": []
            },
            {
              "_id": "5a5e6a76d928509132ec53ef",
              "id": "6KCPMPHOJLGORC6FMVE6WMVG",
              "name": "Al Greens",
              "title": "",
              "image": "",
              "price": 9.5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "KSEGJDAL3K4ZIT5PDXGKC6FO",
                  "name": "Regular Price",
                  "price": 9.5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec53f0",
              "id": "S7UPRBWH2A6V2TSKYNG7R72D",
              "name": "Flu Shot 2",
              "title": "",
              "image": "",
              "price": 5,
              "taxes": 8.75,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "5SJPVYAYP6LCKXXKPG4FVU44",
                  "name": "Regular Price",
                  "price": 5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec53fb",
              "id": "52J6BIJLYPNCXHXHKWVUMJVA",
              "name": "Tigers Blood",
              "title": "",
              "image": "",
              "price": 9.5,
              "taxes": 0,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "M2PN5LPJNPAJO5OY4PCFKZKA",
                  "name": "Regular",
                  "price": 9.5
                }
              ]
            },
            {
              "_id": "5a5e6a76d928509132ec53f8",
              "id": "XJCHMXE6JGAVB3TZGNFNZ7O2",
              "name": "Cold Assassin",
              "title": "",
              "image": "",
              "price": 9.5,
              "taxes": 0,
              "active": true,
              "__v": 0,
              "description": null,
              "created_at": "2018-03-05T15:26:42.355Z",
              "modifiers": [],
              "options": [
                {
                  "id": "JZVM6AVEYVTRPND44N526Y6H",
                  "name": "Regular",
                  "price": 9.5
                }
              ]
            }
          ]
        }
      ]
    };
    return obj;
  }
}

export default new CategoryListStore();


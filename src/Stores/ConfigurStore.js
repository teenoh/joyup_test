import {extendObservable, action, map} from 'mobx'
import api from '../Services/Api'
import _ from 'lodash'
import moment from 'moment'
import apiConfig from '../Config/ApiConfig'
import NavigationStore from './NavigationStore'

class ConfigureStore {
  constructor () {
        extendObservable(this, {
        loading: false,
        
        fetch_business_data: false,
        fetch_order_greeting_data: false,
        fetch_welcome_greeting_data: false,

        fetched_business_data: false,
        fetched_order_greeting_data: false,
        fetched_welcome_greeting_data: false,

        businessInfo: {
            businessHours : [
                { day: "Monday", key:"monday", start: "", end: "", sPeriod:'am', ePeriod:'pm', isOpen: false },
                { day: "Tuesday", key:"tuesday", start: "", end: "",  sPeriod:'am', ePeriod:'pm', isOpen: false },
                { day: "Wednesday", key:"wednesday", start: "", end: "",  sPeriod:'am', ePeriod:'pm', isOpen: false },
                { day: "Thursday", key:"thursday", start: "", end: "",  sPeriod:'am', ePeriod:'pm', isOpen: false },
                { day: "Friday", key:"friday", start: "", end: "",  sPeriod:'am', ePeriod:'pm', isOpen: false },
                { day: "Saturday", key:"saturday", start: "", end: "",  sPeriod:'am', ePeriod:'pm', isOpen: false },
                { day: "Sunday", key:"sunday", start: "", end: "",  sPeriod:'am', ePeriod:'pm', isOpen: false },
            ],
            time_zone: 'America/Los_Angeles',
        },
        orderMessage: {
            message: '',
            button: '',
            hour: 2
        },
        hours: [1,2,3,4,5,6],
        greetingMessage : {
            message: "",
            button:'',
            image: '',
            defaultImage:'assets/burger.jpeg',
            imageFile: null,
            hasImage: false
        },
        updateBusinessTimeZone: this.updateBusinessTimeZone.bind(this),
        saveBusinessTimeZone: this.saveBusinessTimeZone.bind(this),
        onChangeOrderField : this.onChangeOrderField.bind(this),
        saveOrderMessage : this.saveOrderMessage.bind(this),
        saveGreetingMessage: this.saveGreetingMessage.bind(this),
        updateGreetingMessage: this.updateGreetingMessage.bind(this),
        onImageDrop: this.onImageDrop.bind(this)
        })
    }
    getGreetingMessage(){
        
        api.getGreetingMessage().then(response => {
            this.fetch_welcome_greeting_data = true
            this.fetch_order_greeting_data = true
            if( typeof response !== 'undefined' && response.data.length > 0 ){ 
                this.setGreetingMessage(response.data[0])
            }
        })
    }
    setGreetingMessage(data){
        if( typeof data.page_confirmation_button !== 'undefined')
            this.orderMessage.button = data.page_confirmation_button
        if( typeof data.page_confirmation_text !== 'undefined')
            this.orderMessage.message = data.page_confirmation_text    
        if( typeof data.page_welcome_text !== 'undefined')
            this.greetingMessage.message = data.page_welcome_text            
        if( typeof data.page_hero_image !== 'undefined'){ 
            this.greetingMessage.hasImage = true
            this.greetingMessage.image = data.page_hero_image
        }
        if( typeof data.page_welcome_action_button !== 'undefined')
            this.greetingMessage.button = data.page_welcome_action_button            
        
    }
    uploadImage(file){
        console.log("UPLOAD FILE",(file))
        var fileName=file?file.name:""
        const data = new FormData();
        data.append('payload', file);
        data.append('fileName', fileName);
        data.append('merchantId', NavigationStore.getMerchantId());
        
        let url = `https://waitstaff.joyup.me/menu/image`
       console.log("POST>>",data,url)
        return fetch(url, {
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
    saveGreetingMessage(){
        console.log("SAVE GREETING")
        this.fetch_welcome_greeting_data = false
       if(this.greetingMessage.imageFile !== null ){  
            this.uploadImage(this.greetingMessage.imageFile[0]).then(response=>{
                if( typeof response.url !== 'undefined' ){
                    let data = {
                        page_hero_image: response.url,
                        page_welcome_text: this.greetingMessage.message,
                        page_welcome_action_button: this.greetingMessage.button
                    }
                    api.saveGreetingMessage(data).then(res => {
                        this.fetch_welcome_greeting_data = true
                        this.greetingMessage.image = response.url
                    })
                }
            })
       }else{
        let data = {
                page_hero_image: this.greetingMessage.image,
                page_welcome_text: this.greetingMessage.message,
                page_welcome_action_button: this.greetingMessage.button
            }
            api.saveGreetingMessage(data).then(response => {
                this.fetch_welcome_greeting_data = true
            })
        }
      
    }
    updateGreetingMessage(event){
        let { greetingMessage } = this 
        let name = event.target.name
        let value = event.target.value 
        if(name === 'greeting_message')
            greetingMessage.message = value 
        if(name === 'greeting_btn')
            greetingMessage.button = value    
    }
    onImageDrop(file){
        let { greetingMessage } = this
        greetingMessage.image = URL.createObjectURL(file[0])
        greetingMessage.imageFile = file
    }
    getBusinesTimezone(){
        this.fetch_business_data = false
        api.getBusinessTimeZone().then(response => {
            console.log("res: ", response)
            this.fetch_business_data = true
            if( typeof response !== 'undefined' && response.data.length > 0 ){ 
                this.updateBusinessHours(response.data[0])
            }
        })
    }
    updateBusinessHours(response){
        console.log(">>updateBusinessHours ", JSON.stringify(response))
        let { hours_of_operation, time_zone } = response
        let businessInfo = this.businessInfo
        let businessDay = businessInfo.businessHours.map(day=>{
            let eachDay = hours_of_operation ? (typeof hours_of_operation[day.key] === 'undefined' ? null : hours_of_operation[day.key]) : null
            if(eachDay !== null){
                day.start = this.getMilitaryTimeperiod(eachDay.start)
                day.end = this.getMilitaryTimeperiod(eachDay.end)
                day.sPeriod = this.getMilitaryTimeperiod(eachDay.start, true)
                day.ePeriod = this.getMilitaryTimeperiod(eachDay.end, true)
                day.isOpen = true 
                return day
            }
            return day                
        })
        this.businessInfo.time_zone = time_zone
        this.businessInfo.businessHours = businessDay
        
    }
    getMilitaryTimeperiod(input, isPeriod = false ){
        if( isPeriod )
            return moment(input, 'HHmm').format('a');
        else
            return moment(input, 'HHmm').format('h:mm');
    }
    getRegularTime(input){
        return moment(input, ["h:mm a"]).format("HHmm");
    }

    updateBusinessTimeZone(event){
        let name = event.target.name;
        let value = event.target.value 
        if( name === 'business_timezone'){
            this.businessInfo.time_zone = value
        }
    }
    saveBusinessTimeZone(){
        let {businessHours} =  this.businessInfo
        let data = {hours_of_operation: {}, time_zone: this.businessInfo.time_zone } 
        businessHours.map(hrs=> {
            if(hrs.isOpen){ 
                data.hours_of_operation[hrs.key] = {
                    start: this.getRegularTime(hrs.start+' '+hrs.sPeriod), 
                    end: this.getRegularTime(hrs.end+' '+hrs.ePeriod),
                }
            }
        })
        this.fetch_business_data = false
        api.saveTimeZone(data).then(response=>{
            this.fetch_business_data = true
        })
    }


    onChangeOrderField(event){
        let name = event.target.name
        let value = event.target.value 
        if(name === 'order_message')
            this.orderMessage.message = value 
        if(name === 'order_btn')
            this.orderMessage.button = value   
    }
    saveOrderMessage(){
        this.fetch_order_greeting_data = false
        let data = {
            page_confirmation_text: this.orderMessage.message,
            page_confirmation_button: this.orderMessage.button
        }
        api.saveOrderMessage(data).then(response => {
            this.fetch_order_greeting_data = true
            // console.log("save order message: ", response)
        })
    }
}

export default new ConfigureStore();
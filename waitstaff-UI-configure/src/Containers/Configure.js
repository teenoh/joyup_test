
import React, {Component} from 'react';
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types';
import './Styles/grid.css'
import './Styles/Configure.css'
import Dropzone from 'react-dropzone'
import CircularProgress from 'material-ui/CircularProgress';
import timezones from '../Services/timezone.json'

import moment from 'moment'

class Configure extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){
        // console.log("props:", this.props)
        this.props.configureStore.getGreetingMessage()
        this.props.configureStore.getBusinesTimezone()
    }

    updateBusinessHours(index, event){
        let { configureStore:{businessInfo} } = this.props 
        let { businessHours } = businessInfo
        let currentBusinessHours = businessHours[index]
        let value  = event.target.value 
        let name = event.target.name 
        if( name === 'business_day' ){ 
            currentBusinessHours.isOpen = !currentBusinessHours.isOpen
        }
        if( name === 'business_start_time'){
            currentBusinessHours.start = value 
        }
        if( name === 'business_end_time'){
            currentBusinessHours.end = value 
        }
        if( name === 'business_start_period'){
            currentBusinessHours.sPeriod = value 
        }
        if( name === 'business_end_period'){
            currentBusinessHours.ePeriod = value
        }
        businessHours[index] = currentBusinessHours
        businessInfo.businessHours = businessHours
    }

    render(){
        let { configureStore:{ 
            greetingMessage,
            updateGreetingMessage,
            onImageDrop,
            saveGreetingMessage,
            hours,
            orderMessage,
            onChangeOrderField,
            saveOrderMessage,
            businessInfo, 
            updateBusinessTimeZone,
            saveBusinessTimeZone,
            
            fetch_business_data,
            fetch_order_greeting_data,
            fetch_welcome_greeting_data,


        } } = this.props 
        let { businessHours } = businessInfo
        return(
            <div className="config-container">
                
               <div className="configure-box flex-box justify-content-space-between">
                    <div className="flex-1 left-column">
                        <div className="panel-box">
                            <div className="panel-header"> <h3 className="title">Greeting Message</h3></div>
                            <div className="panel-body">
                                {!fetch_welcome_greeting_data && <div className="loader-mask"/>}
                                <div className="image-upload-box">
                                    <Dropzone
                                        className="image-upload-box"
                                        multiple={false}
                                        accept="image/*"
                                        onDrop={file=> onImageDrop(file)}>
                                        <div className="dropArea">
                                            {(greetingMessage.image !== '' ) ? 
                                                <img  id="uploadImageId" src={ greetingMessage.image  } alt="Configure image"/>
                                                :
                                                <div className="upload-icon">
                                                    <img src="assets/camera-alt.svg"/>
                                                </div>
                                            }
                                        </div>
                                    </Dropzone>
                                </div>
                                <div className="greeting-message">
                                    <textarea onChange={(e)=>updateGreetingMessage(e)} value={greetingMessage.message} name="greeting_message"/>
                                </div>
                                <div className="button-field">
                                    <input type="text" value={greetingMessage.button} onChange={(e)=>updateGreetingMessage(e)} name="greeting_btn"/> 
                                </div>
                            </div>
                            <div className="panel-footer flex-box">
                                <div className="button button-spaicy" onClick={()=>saveGreetingMessage()}> 
                                 {fetch_business_data ? 'save': 'saving'} </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 right-column"> 
                        <div className="panel-box order-confirmation-box">
                            <div className="panel-header"> <h3 className="title">Store Closed Away Message</h3></div>
                            <div className="panel-body">
                                {!fetch_order_greeting_data && <div className="loader-mask"/>}
                                <div className="greeting-message">
                                    <textarea onChange={e => onChangeOrderField(e)} value={orderMessage.message} name="order_message"/>
                                </div>
                                <div className="button-field">
                                    <input type="text" value={orderMessage.button} onChange={e => onChangeOrderField(e)} name="order_btn"/> 
                                </div>
                            </div>
                            <div className="panel-footer flex-box">
                                <div className="button button-spaicy" onClick={ ()=>saveOrderMessage() }> Save </div>
                            </div>
                        </div>
                    </div>
               </div>
               <div className="locations-hours-container">
                    <div className="panel-box">
                        <div className="panel-header"> <h3 className="title"> Business Time and Location </h3></div>
                        <div className="panel-body">
                        {!fetch_business_data && <div className="loader-mask"/>}
                            <div className="business-timezone flex-box align-item-center">
                                <div className="location-label">Time Zone </div>
                                <div className="flex-1 timezonelist">
                                    <select name="business_timezone" value={businessInfo.time_zone} onChange={ e => updateBusinessTimeZone(e)}>
                                        <option selected> Select Time Zone </option>
                                        { timezones.map((timezone, index)=> {
                                            return <option key={index} value={timezone.value}> {timezone.text} </option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="business-week">
                                { businessHours.map((day, index)=> {
                                    return ( 
                                        <div className="week-day flex-box align-item-center" key={index}>
                                            <div className="day-field">
                                                <input type="checkbox" name="business_day" id={day.day} checked={day.isOpen} value="monday" onChange={this.updateBusinessHours.bind(this, index)}/> <label htmlFor={day.day}>{day.day}</label>
                                            </div>
                                            <div className="day-opening-time flex-1 flex-box align-item-center justify-content-space-between">
                                                <div className="start-time openning-time-box flex-box flex-1 align-item-center">
                                                    <div className="time-field">
                                                        <input type="text" placeholder="Start" value={day.start} name="business_start_time" onChange={this.updateBusinessHours.bind(this, index)}/>
                                                    </div>
                                                    <select name="business_start_period" value={day.sPeriod} onChange={this.updateBusinessHours.bind(this, index)}>
                                                        <option selected={day.ePeriod === 'am'} value="am"> AM </option>
                                                        <option selected={day.ePeriod === 'am'} value="pm"> PM </option>
                                                    </select>
                                                </div>
                                                <div className="end-time openning-time-box flex-2 flex-box align-item-center">
                                                    <div className="time-field">
                                                        <input type="text" placeholder="End" value={day.end} name="business_end_time" onChange={this.updateBusinessHours.bind(this, index)}/>
                                                    </div>
                                                    <select name="business_end_period" value={day.ePeriod} onChange={this.updateBusinessHours.bind(this, index)}>
                                                        <option selected={day.ePeriod === 'am'} value="am"> AM </option>
                                                        <option selected={day.ePeriod === 'pm'} value="pm" selected> PM </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                )}
                                
                            </div>
                        </div>
                        <div className="panel-footer flex-box">
                            <div className="button button-spaicy" onClick={ () => saveBusinessTimeZone() }> Save </div>
                        </div>
                    </div>
                   
               </div>
            </div>
        )
    }
}

export default inject('configureStore')(observer(Configure))

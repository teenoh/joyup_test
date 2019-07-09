import React, {Component} from 'react';
//import '../Containers/Styles/CategoryListStyles.css';
import {observer, inject} from 'mobx-react'
import ReactFileReader from 'react-file-reader';
import '../Containers/Styles/CategoryUpdateScreen.css';
import Spinner from './Spinner'


class ImageLoader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false
        }
    }

    renderPlaceholder() {
        return <div className="image_placeholder" key="image_placeholder"/>;
    };

    handleImageOnLoad() {
        this.setState({
            isLoaded: true
        })
    };

    renderSpinner(loading) {
        //let loading = (this.state.isLoaded || this.props.loading);
        if (loading) return <div><Spinner/></div>
    }

    renderImage(url) {
        let loading = (!this.state.isLoaded || this.props.loading);
        let displayImg = loading ? 'none' : 'block';
        return <div className="image-spinner_container">
            <img style={{maxWidth: '7em', maxHeight: '5em', display: displayImg}} src={url}
                 onLoad={() => this.handleImageOnLoad()}/>
            {/*<div style={{display:displaySpn}}><Spinner/></div>*/}
            {this.renderSpinner(loading)}
        </div>;
        //else return <Spinner/>;
    }

    switcher() {
        if (this.props.imageUrl) {
            return this.renderImage(this.props.imageUrl);
        } else {
            return this.renderPlaceholder();
        }
    };


    render() {

        return <ReactFileReader handleFiles={(e) => {
            this.props.callback(e.fileList[0])
        }} base64>
            <div style={{width: '7em'}}>

                {this.switcher()}
                <div className='tap_to_edit' key='tap_to_edit'>Tap To Edit</div>
            </div>
        </ReactFileReader>

    }
}

export default inject('categoryListStore', 'categoryUpdateStore', 'navigationStore')(observer(ImageLoader))
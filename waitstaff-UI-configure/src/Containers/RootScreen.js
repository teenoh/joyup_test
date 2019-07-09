import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import './Styles/RootStyles.css';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import ActionHome from 'material-ui/svg-icons/action/shopping-cart';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {observer, inject} from 'mobx-react'

export default inject('navigationStore')(observer(
    class  extends Component {
        render() {
            const {isOpenMenu, activeScreen, openMenu, targetView} = this.props.navigationStore;
            targetView('currentUnit');
            return (
                <div className="view_container">
                   {/* <div className="header__wrapper">
                    <AppBar
                        className="header" style={{backgroundColor: '#69e2c7'}}
                        onLeftIconButtonClick={openMenu}
                    >
                        <div className="header__inner">
                            <Avatar src={"/assets/avatar.png"}/>
                        </div>
                        <div style={{flex: 0, flexDirection: 'column', justifyContent: 'center'}}>
                            <FlatButton icon={ <ActionHome color="white"/>} />
                        </div>
                    </AppBar>
                    </div>

                    <Drawer open={isOpenMenu} docked={false} containerStyle={{paddingTop:'3em'}}>
                        <MenuItem onClick={() => {
                            this.props.navigationStore.changeScreen('category')
                        }}>Categories</MenuItem>
                        <MenuItem onClick={() => {
                            this.props.navigationStore.changeScreen('item')
                        }}>Products</MenuItem>

                    </Drawer>*/}
                    {activeScreen}
                    {/* {targetView('currentUnit')} */}
                </div>
            )
        }
    }))
import React, {Component} from 'react';
import './App.css';
import {Provider} from 'mobx-react'
import stores from './Stores'
import RootScreen from './Containers/RootScreen'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import theme from './theme';

const muiTheme = getMuiTheme(theme);


class App extends Component {
    render () {
        return (
            <Provider {...stores}>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <RootScreen />
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;

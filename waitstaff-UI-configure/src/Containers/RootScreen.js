import { observer, inject } from "mobx-react";
import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import "./Styles/RootStyles.css";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "material-ui/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

import { Sidebar } from "../Components"

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    marginLeft: drawerWidth,
    backgroundColor: "#69e2c7",
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  headerMenu: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    marginRight: "auto",
    marginLeft: "auto",
    [theme.breakpoints.up("sm")]: {
      visibility: 'hidden'
    }
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#F1F1F1',
  }
});

const menuItems = [
  {
    id: 1,
    label: "Dashboard",
    route: "dashboard",
    icon: 'home'
  },
  {
    id: 2,
    label: "Configure",
    route: "configure",
    icon: 'settings'
  }
];

class Root extends Component {
  render() {
    const {
      isOpenMenu,
      activeScreen,
      currScreenName,
      openMenu,
      closeMenu,
      changeScreen,
      targetView
    } = this.props.navigationStore;
    const { classes } = this.props;
    targetView("currentUnit");
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <div className={classes.headerMenu}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                edge="start"
                onClick={openMenu}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>

              <Avatar
                className={classes.headerLogo}
                src={"/assets/avatar.png"}
              />
              <Avatar src={'https://randomuser.me/api/portraits/men/40.jpg'} />
            </div>
          </Toolbar>
        </AppBar>

        <Sidebar
            open={isOpenMenu}
            closeMenu={closeMenu}
            changeScreen={changeScreen}
            currScreenName={currScreenName}
            menuItems={menuItems}
        />

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {activeScreen}
        </main>
        {/* {targetView('currentUnit')} */}
      </div>
    );
  }
}

export default withStyles(styles)(inject("navigationStore")(observer(Root)));

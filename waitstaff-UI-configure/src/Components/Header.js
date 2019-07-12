import React, { Component } from 'react'
import AppBar from "@material-ui/core/AppBar";
import Avatar from "material-ui/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";


import { withStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const styles = theme => ({
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
    alignItems: "center"
  },
  headerLogo: {
    marginRight: "auto",
    marginLeft: "auto",
    [theme.breakpoints.up("sm")]: {
      visibility: "hidden"
    }
  }
});

const Header = ({ classes, openMenu, headerLogo }) => {
    return (
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
            <Avatar
              src={"https://randomuser.me/api/portraits/men/40.jpg"}
            />
          </div>
        </Toolbar>
      </AppBar>
    );
}

export default withStyles(styles)(Header)
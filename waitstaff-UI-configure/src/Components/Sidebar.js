import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import { withStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000051",
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    width: drawerWidth
  }
});

const drawer = (classes, changeScreen, currScreen, menuItems) => (
  <div>
    <div className={classes.drawerHeader}>
      <Avatar src={"/assets/avatar.png"} />
    </div>
    <Divider />
    <List>
      {menuItems.map(({ label, id, icon, route }) => (
        <ListItem
          button
          selected={currScreen == route ? true : false}
          onClick={() => {
            changeScreen(route);
          }}
          key={id}
        >
          <ListItemIcon>
            {icon == "home" ? (
              <HomeIcon />
            ) : icon == "settings" ? (
              <SettingsIcon />
            ) : (
              ""
            )}
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItem>
      ))}
    </List>
  </div>
);

const Sidebar = ({
  open,
  closeMenu,
  classes,
  changeScreen,
  currScreenName,
  menuItems
}) => {
  return (
    <nav className={classes.drawer} aria-label="sidebar-nav">
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={open}
          onClose={closeMenu}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true
          }}
        >
          {drawer(classes, changeScreen, currScreenName, menuItems)}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          {drawer(classes, changeScreen, currScreenName, menuItems)}
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default withStyles(styles)(Sidebar);

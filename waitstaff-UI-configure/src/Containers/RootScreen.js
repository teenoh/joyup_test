import { observer, inject } from "mobx-react";
import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import "./Styles/RootStyles.css";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "material-ui/Avatar";
import ActionHome from "material-ui/svg-icons/action/shopping-cart";
import Drawer from "@material-ui/core/Drawer";
import MenuItem from "material-ui/MenuItem";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home"
import SettingsIcon from "@material-ui/icons/Settings"
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
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
  drawerHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000051",
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
});

const menuItems = [
  {
    id: 1,
    label: "Dashboard",
    route: "dashboard",
    icon: <HomeIcon />
  },
  {
    id: 2,
    label: "Configure",
    route: "configure",
    icon: <SettingsIcon />
  }
];

const drawer = (classes, changeScreen, currScreen) => (
  <div>
    <div className={classes.drawerHeader}>
      <Avatar src={"/assets/avatar.png"} />
    </div>
    <Divider />
    <List>
      {menuItems.map(({ label, id, icon, route }) => (
        <ListItem
          button
          selected={currScreen == route ? true: false }
          onClick={() => {
            changeScreen(route);
          }}
          key={id}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} />
        </ListItem>
      ))}
    </List>
  </div>
);

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

        <nav className={classes.drawer} aria-label="sidebar-nav">
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              open={isOpenMenu}
              onClose={closeMenu}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true
              }}
            >
              {drawer(classes, changeScreen, currScreenName)}
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
              {drawer(classes, changeScreen, currScreenName)}
            </Drawer>
          </Hidden>
        </nav>
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

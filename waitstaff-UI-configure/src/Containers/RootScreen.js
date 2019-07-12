import { observer, inject } from "mobx-react";
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

import { Header, Sidebar } from "../Components"
import { constants } from "../Utils"

const { MENU_ITEMS } = constants
const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#F1F1F1',
  }
});

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
        <Header
            openMenu={openMenu}
            headerLogo={'/assets/avatar.png'}
         />

        <Sidebar
            open={isOpenMenu}
            closeMenu={closeMenu}
            changeScreen={changeScreen}
            currScreenName={currScreenName}
            menuItems={MENU_ITEMS}
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

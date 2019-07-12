import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import { AgencyCard, ConfigEditPopup } from "../Components";

const styles = theme => ({
  topCard: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    boxShadow: "1px 1px 3px rgba(201, 201, 201, 0.5)"
  },
  mr2: {
    marginRight: theme.spacing(2)
  },
  formControl: {
    width: "100%"
  },
  mb4: {
    marginBottom: theme.spacing(4)
  },
  statsInfo: {
    display: "flex",
    alignItems: "center"
  },
  boxShadow: {
    boxShadow: "1px 1px 3px rgba(201, 201, 201, 0.5)"
  }
});

const companies = [
  {
    id: 1,
    name: "Pizza Hut",
    image:
      "https://banner2.kisspng.com/20180807/wo/kisspng-pizza-hut-logo-symbol-food-fair-lakes-pizza-hut-5b693b93c0d2c3.3095130015336231877898.jpg"
  },
  {
    id: 2,
    name: "KFC",
    image:
      "https://www.clipartmax.com/png/middle/435-4357552_nyancraftergs-profile-member-list-minecraft-forum-transparent-background-kfc-logo.png"
  },
  {
    id: 3,
    name: "Burger King",
    image:
      "http://images6.fanpop.com/image/photos/39800000/Burger-King-Logo-3-nintendofan12-5-39800948-300-300.png"
  },
  {
    id: 4,
    name: "McDonalds",
    image:
      "https://listimg.pinclipart.com/picdir/s/341-3414499_brand-logo-mcdonalds-logo-circle-clipart.png"
  },
  {
    id: 5,
    name: "Starbucks",
    image:
      "https://diylogodesigns.com/wp-content/uploads/2018/09/Starbucks_Coffee_Logo.png-768x768.png"
  }
];

class Dashboard extends Component {
  state = {
    dialogOpen: false,
    activeCompany: null,
    fbAcct: "pizza",
    sqAcct: "sq1",
    searchTxt: ""
  };

  openDialog = () => {
    this.setState({ dialogOpen: true });
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  };

  setActiveCompany = company => {
    this.setState({ activeCompany: company });
    this.openDialog();
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    const { searchTxt } = this.state;
    const filteredCompanies = companies.filter(company =>
      company.name
        .trim()
        .toLowerCase()
        .includes(searchTxt.toLowerCase())
    );
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={[classes.topCard, classes.boxShadow]}>
            <Grid container spacing={2}>
              <Grid className={classes.statsInfo} item xs={6} lg={2}>
                <Typography
                  className={classes.mr2}
                  color="primary"
                  component="h5"
                >
                  All Users
                </Typography>
                <Typography component="h5">8 total</Typography>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <FormControl fullWidth>
                  <Input
                    id="input-with-icon-adornment"
                    placeholder="Search here"
                    onChange={e =>
                      this.handleChange("searchTxt", e.target.value)
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {filteredCompanies.map(({ name, id, image }) => (
          <Grid key={id} item xs={12} md={6} lg={3}>
            <AgencyCard
              company={{ name, id, image }}
              setActiveCompany={this.setActiveCompany}
            />
          </Grid>
        ))}

        <ConfigEditPopup
          open={this.state.dialogOpen}
          handleClose={this.closeDialog}
          company={this.state.activeCompany}
          activeFbAcct={this.state.fbAcct}
          activeSqAcct={this.state.sqAcct}
          handleChange={this.handleChange}
        />
      </Grid>
    );
  }
}

export default inject("navigationStore")(
  observer(withStyles(styles)(Dashboard))
);

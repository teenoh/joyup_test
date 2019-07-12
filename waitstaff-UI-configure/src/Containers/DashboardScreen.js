import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import PropTypes from "prop-types";
import "./Styles/grid.css";
import "./Styles/Configure.css";
import "./Styles/Dashboard.css";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SettingsIcon from "@material-ui/icons/Settings";


import { ConfigEditPopup } from '../Components'

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
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  companyLogo: {
    height: 100,
    width: 100,
    borderRadius: "50%"
  },
  newBtn: {
    background: "linear-gradient(to right, #000051 0%,  #69e2c7 90%)",
    marginLeft: "auto"
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

  setActiveCompany = (company) => {
      this.setState({ activeCompany: company})
      this.openDialog()
  }

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
                <Typography component="h5">
                  8 total
                </Typography>
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
            <Card className={classes.card}>
              <CardHeader
                action={
                  <IconButton
                    onClick={() => this.setActiveCompany({name, id, image})}
                    aria-label="Settings"
                  >
                    <SettingsIcon />
                  </IconButton>
                }
              />
              <CardContent className={classes.cardContent}>
                <Avatar src={image} className={classes.companyLogo} />
                <Typography color="primary" variant="h6">
                  {name}
                </Typography>
              </CardContent>
              <Divider light />
              <CardActions>
                <Typography variant="body1">Marvel Comics</Typography>
                <Button
                  className={classes.newBtn}
                  size="small"
                  color="primary"
                  variant="contained"
                >
                  New
                </Button>
              </CardActions>
            </Card>
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

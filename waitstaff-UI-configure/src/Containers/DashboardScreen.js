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
import { constants } from "../Utils";

const { AGENCIES } = constants;
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



class Dashboard extends Component {
  state = {
    dialogOpen: false,
    activeAgency: null,
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

  setActiveAgency = agency => {
    this.setState({ activeAgency: agency });
    this.openDialog();
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    const { searchTxt } = this.state;
    const filteredAgencies = AGENCIES.filter(agency =>
      agency.name
        .trim()
        .toLowerCase()
        .includes(searchTxt.toLowerCase())
    );
    console.log(filteredAgencies)
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

        {filteredAgencies.map(({ name, id, image }) => (
          <Grid key={id} item xs={12} md={6} lg={3}>
            <AgencyCard
              agency={{ name, id, image }}
              setActiveAgency={this.setActiveAgency}
            />
          </Grid>
        ))}

        <ConfigEditPopup
          open={this.state.dialogOpen}
          handleClose={this.closeDialog}
          agency={this.state.activeAgency}
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

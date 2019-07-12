import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  agencyLogo: {
    height: 100,
    width: 100,
    borderRadius: "50%"
  },
  newBtn: {
    background: "linear-gradient(to right, #000051 0%,  #69e2c7 90%)",
    marginLeft: "auto"
  },
  mb4: {
    marginBottom: theme.spacing(4)
  },
  boxShadow: {
    boxShadow: "1px 1px 3px rgba(201, 201, 201, 0.5)"
  }
});

const AgencyCard = ({ classes, setActiveAgency, agency }) => {
    const {id, image, name} = agency
    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <IconButton
              onClick={() => setActiveAgency(agency)}
              aria-label="Settings"
            >
              <SettingsIcon />
            </IconButton>
          }
        />
        <CardContent className={classes.cardContent}>
          <Avatar src={image} className={classes.agencyLogo} />
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
    );
}

export default withStyles(styles)(AgencyCard)
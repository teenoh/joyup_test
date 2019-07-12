import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  formControl: {
    width: "100%"
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: '50%'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  },
  mb4: {
    marginBottom: theme.spacing(4)
  }
});

const ConfigEditPopup = ({
  activeFbAcct,
  activeSqAcct,
  company,
  classes,
  handleClose,
  handleChange,
  open
}) => {
  return (
    <Dialog maxWidth="xs" fullWidth={true} open={open} onClose={handleClose}>
      <DialogTitle>{`Edit ${company &&
        company.name} configuration`}</DialogTitle>
      <DialogContent>
        <div className={classes.logoContainer}>
          <Avatar
            src={company && company.image}
            className={classes.logo}
          />
        </div>
        <form>
          <FormControl className={[classes.formControl, classes.mb4]}>
            <InputLabel htmlFor="fbAcct">Facebook Account</InputLabel>
            <Select
              value={activeFbAcct}
              onChange={e => handleChange("fbAcct", e.target.value)}
              inputProps={{
                name: "age",
                id: "fbAcct"
              }}
            >
              <MenuItem value="pizza">Ten</MenuItem>
              <MenuItem value="banana">Twenty</MenuItem>
              <MenuItem value="plantain">Thirty</MenuItem>
            </Select>
            <FormHelperText>Select Facebook Account</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="sqAcct">Square Account</InputLabel>
            <Select
              value={activeSqAcct}
              placeholder="Select Square Account"
              onChange={e => handleChange("sqAcct", e.target.value)}
              inputProps={{
                name: "age",
                id: "sqAcct"
              }}
            >
              <MenuItem value="sq1">Square 1</MenuItem>
              <MenuItem value="sq2">Square 2</MenuItem>
              <MenuItem value="sq3">Square 3</MenuItem>
            </Select>
            <FormHelperText>Select Square Account</FormHelperText>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="danger">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(ConfigEditPopup);

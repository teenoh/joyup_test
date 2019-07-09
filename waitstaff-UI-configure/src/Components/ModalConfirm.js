/**
 * Created by Yury-PC on 02.03.2018.
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import './Styles/ModalConfirmStyles.css';

export default class ModalConfirm extends Component {
  render () {
    return (
      <Dialog
        modal={true}
        open={this.props.isOpen}
      >
        <div className="labelModalWrapper">
          <label className="labelModal">
            {this.props.text}
          </label>
        </div>
        <div className="buttonActionModal">
          <RaisedButton
            label={this.props.cancelText || 'cancel'}
            onClick={(...e) => {
              if(this.props.onCancel) {
                this.props.onCancel(...e)
              }
            }}
          />
          <RaisedButton
            primary
            label={this.props.confirmText || 'ok'}
            onClick={(...e) => {
              if(this.props.onConfirm) {
                this.props.onConfirm(...e)
              }
            }}
          />
        </div>
      </Dialog>
    )
  }
}

ModalConfirm.propTypes = {
  isOpen: PropTypes.bool,
  text: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
}
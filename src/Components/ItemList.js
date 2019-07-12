/**
 * Created by Yury-PC on 02.03.2018.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import CakeIcon from 'material-ui/svg-icons/social/cake';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import './Styles/ItemListStyles.css';

export default class ItemList extends Component {
  render () {
    const {data} = this.props
    return (
      <Table
        className={'table'}
        style={{tableLayout:'auto !important'}}
      >
        <TableHeader
          displaySelectAll={false }
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn className={'column_image'}>Image</TableHeaderColumn>
            <TableHeaderColumn className={'column'}>Name</TableHeaderColumn>
            <TableHeaderColumn className={'column_price'}>Price</TableHeaderColumn>
            <TableHeaderColumn className={'column_icon'} />
            <TableHeaderColumn className={'column_icon'} />
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {data.map((row, index) => {
            const avatar = row.image
            ? <Avatar src={row.image} style={{borderRadius: 0}}/>
              : <Avatar
                icon={<CakeIcon />}
                style={{borderRadius: 0}}
              />
            return <TableRow key={index} >
              <TableRowColumn className={'column_image'}>{avatar}</TableRowColumn>
              <TableRowColumn className={'column'}>{row.name}</TableRowColumn>
              <TableRowColumn className={'column_price'}>{row.price}</TableRowColumn>
              <TableRowColumn className={'column_icon'}>
                <IconButton
                  style={{padding: 0}}
                  onClick={(e) => {
                  if (this.props.onItemEdit) {
                    this.props.onItemEdit(row)
                  }
                  e.stopPropagation()
                }} >
                  <EditIcon color={'#4b4947'} />
                </IconButton>
              </TableRowColumn>
              <TableRowColumn className={'column_icon'}>
                <IconButton
                  style={{padding: 0}}
                  onClick={(e) => {
                  if (this.props.onItemDelete) {
                    this.props.onItemDelete(row)
                  }
                  e.stopPropagation()
                }} >
                  <DeleteIcon color={'#4b4947'} />
                </IconButton>
              </TableRowColumn>
            </TableRow>
          })}
        </TableBody>
      </Table>
    )
  }
}

ItemList.propTypes = {
  data: PropTypes.array,
  onRowClick: PropTypes.func,
  onItemEdit: PropTypes.func,
  onItemDelete: PropTypes.func,
}
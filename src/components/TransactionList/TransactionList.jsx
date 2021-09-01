import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import useStyles from './TransactionList.style'

function TransactionList({ transactions = [] }) {
  if (transactions.length == 0) {
    return null;
  }
  const classes = useStyles();
  return (
    <div>
      <Typography variant="subtitle1">Transaction History</Typography>
      <List>
        {transactions.map(item => (
          <ListItem key={item} className={classes.item}>
            <a href={`https://ropsten.etherscan.io/tx/${item}`} target="_blank">{item}</a>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default TransactionList;

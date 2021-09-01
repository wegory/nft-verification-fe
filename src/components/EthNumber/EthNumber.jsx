import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { showEthNumber } from '../../utils/ethereumConvert';
import useStyles from './EthNumber.style';

function EthNumber({ balance, onClick }) {
  if (balance === null || balance === undefined) {
    return null;
  }

  const classes = useStyles();

  return (
    <div className={classes.ethNumber} onClick={onClick}>
      <Tooltip title={showEthNumber(balance, 9)}>
        <Typography variant="h4">
          <span>{showEthNumber(balance)}</span>
          &nbsp;
          <span>ETH</span>
        </Typography>
      </Tooltip>
    </div>
  )
}

export default EthNumber

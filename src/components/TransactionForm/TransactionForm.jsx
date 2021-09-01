import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import useStyles from './TransactionForm.style';

const schema = yup.object().shape({
  address: yup.string().required(),
  value: yup.number().positive().required(),
  gasPrice: yup.number().positive().required(),
  gasLimit: yup.number().positive().integer().required(),
});

const DEFAULT_VALUE = {
  address: '',
  value: '',
  gasPrice: 1,
  gasLimit: 21000
}


function TransactionForm({ onSubmit, disabled }) {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset(DEFAULT_VALUE);
  }, []);

  const handleFormSubmit = async (event) => {
    await handleSubmit(onSubmit)(event);
    reset(DEFAULT_VALUE);
  }

  const { ref: addressRef, ...addressProps } = register('address');
  const { ref: valueRef, ...valueProps } = register('value');
  const { ref: gasPriceRef, ...gasPriceProps } = register('gasPrice');
  const { ref: gasLimitRef, ...gasLimitProps } = register('gasLimit');

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.paper} elevation={2}>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="To Address"
                fullWidth
                error={!!errors.address}
                helperText={errors?.address?.message}
                inputRef={addressRef}
                {...addressProps}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Value"
                fullWidth
                error={!!errors.value}
                helperText={errors?.value?.message}
                inputRef={valueRef}
                {...valueProps}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Gas Price"
                fullWidth
                error={!!errors.gasPrice}
                helperText={errors?.gasPrice?.message}
                inputRef={gasPriceRef}
                {...gasPriceProps}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Gas Limit"
                fullWidth
                error={!!errors.gasLimit}
                helperText={errors?.gasLimit?.message}
                inputRef={gasLimitRef}
                {...gasLimitProps}
                disabled={disabled}
              />
            </Grid>
          </Grid>
          <Grid className={classes.submitArea} item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={disabled}
            >
              Send
            </Button>
          </Grid>
        </form>
      </Paper>
    </div>
  )
}

export default TransactionForm;

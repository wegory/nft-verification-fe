import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  account: {
    textAlign: 'center',
  },
  connectButton: {
    margin: '2em',
  },
  toggleForm: {
    '& svg': {
      transition: 'transform .5s ease-in-out',
    }
  },
  hideForm: {
    transform: 'rotate(180deg)',
  }
}));

export default useStyles;

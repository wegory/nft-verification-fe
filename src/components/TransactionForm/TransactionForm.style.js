import { makeStyles } from '@material-ui/core/styles';

const formMargin = '2em';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: `${formMargin} auto`,
    width: '80vw',
    maxWidth: '40em',
  },
  paper: {
    padding: formMargin,
  },
  submitArea: {
    marginTop: formMargin,
  }
}));

export default useStyles;

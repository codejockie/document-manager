import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const styles = theme => ({
  appBar: {
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  card: {
    maxWidth: 500,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  flex: {
    flex: 1,
    textDecoration: 'none',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  grid: {
    margin: '17rem -12px'
  },
  input: {
    display: 'none',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  signUpGrid: {
    margin: '10rem -12px'
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
});

export default styles;

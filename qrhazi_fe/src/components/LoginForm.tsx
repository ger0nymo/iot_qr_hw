import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import QrCode from '@mui/icons-material/QrCode';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import { register, login } from '../api/auth';
import { Alert } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import { retrieveUser } from '../api/user';
import { CircularProgress } from '@mui/material';

const isDarkStored = localStorage.getItem('isDarkTheme') === 'true';

export default function SignIn() {
  const [usernameError, setUsernameError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();

  React.useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const user = await retrieveUser();
    if (user) {
      navigate('/');
    }
    setLoading(false);
  };

  const theme = createTheme({
    palette: {
      mode: localStorage.getItem('isDarkTheme') === 'true' ? 'dark' : 'light',
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const validateUsername = (username: string) => {
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      return false;
    } else if (username.length > 15) {
      setUsernameError('Username must be at most 15 characters long');
      return false;
    } else if (username.includes(' ')) {
      setUsernameError('Username must not contain spaces');
      return false;
    } else {
      setUsernameError('');
      return true;
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    } else if (password.length > 20) {
      setPasswordError('Password must be at most 20 characters long');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    validatePassword(data.get('password') as string);

    const canSubmit =
      validateUsername(data.get('username') as string) &&
      validatePassword(data.get('password') as string);

    if (canSubmit) {
      try {
        const result = await login(
          data.get('username') as string,
          data.get('password') as string
        );

        const token = result.data['access_token'];
        const expireDate = new Date(
          new Date().getTime() + 2 * 24 * 60 * 60 * 1000
        ).toUTCString();
        const cookieString = `token=${token}; expires=${expireDate};`;

        document.cookie = cookieString;

        if (result.status === 200) {
          navigate('/');
        }
      } catch (error) {
        setSnackbarOpen(true);
      }
    }
  };

  return !loading ? (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 70, height: 70 }}>
            <QrCode sx={{ fontSize: 35 }} />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <TextField
                  helperText={usernameError}
                  error={usernameError ? usernameError.length > 0 : false}
                  margin='normal'
                  required
                  fullWidth
                  id='username'
                  label='Username'
                  name='username'
                  autoComplete='username'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  helperText={passwordError}
                  error={passwordError ? passwordError.length > 0 : false}
                  margin='normal'
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  autoComplete='current-password'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword && <Visibility />}
                          {!showPassword && <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type='submit'
              size='large'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent='right'>
              <Grid item xs='auto'>
                <Link href='/signup' variant='h6' underline='none'>
                  Sign up
                </Link>
              </Grid>
            </Grid>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={2500}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert severity='error'>
                Error while logging in. Please check your credentials and try
                again.
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  ) : (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
    </Grid>
  );
}

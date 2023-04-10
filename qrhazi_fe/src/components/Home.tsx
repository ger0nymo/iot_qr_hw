import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { checkToken } from '../api/auth';
import CircularProgress from '@mui/material/CircularProgress';
import { retrieveUser, User } from '../api/user';
import { BottomNavigationBar } from './BottomNavigationBar';
import { Card, CardContent, CardHeader, CardMedia } from '@mui/material';
import { MaterialUISwitch } from './MaterialUISwitch';
import FormControl from '@mui/material/FormControlLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material/styles';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { QRPage } from './QrPage';
import { AdminPanel } from './AdminPanel';

interface MyThemeOptions extends ThemeOptions {
  canEnterBgColor: string;
  cantEnterBgColor: string;
}

export default function HomePage() {
  const [isLoading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);
  const [checked, setChecked] = React.useState(
    localStorage.getItem('isDarkTheme') === 'true' || false
  );
  const [navigationValue, setNavigationValue] = React.useState('profile');
  const [isDarkTheme, setIsDarkTheme] = React.useState(
    localStorage.getItem('isDarkTheme') === 'true' || false
  );

  const light: MyThemeOptions = {
    palette: {
      mode: 'light',
    },
    canEnterBgColor: '#81c784',
    cantEnterBgColor: '#ff8a80',
  };

  const dark: MyThemeOptions = {
    palette: {
      mode: 'dark',
    },

    canEnterBgColor: '#2e7d32',
    cantEnterBgColor: '#d32f2f',
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    localStorage.setItem('isDarkTheme', event.target.checked.toString());
    setIsDarkTheme((isDarkTheme) => !isDarkTheme);
  };

  const handleNavigationChange = (
    event: React.ChangeEvent<{}>,
    newValue: string
  ) => {
    setNavigationValue(newValue);
  };

  const navigate = useNavigate();

  function signOut() {
    const cookieString = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = cookieString;

    navigate('/login');
  }

  React.useEffect(() => {
    getUserData();
  }, [navigationValue]);

  const getUserData = async () => {
    const user = await retrieveUser();
    if (user) {
      setUser(user);
      setLoading(false);
    } else {
      navigate('/login');
    }
  };

  return !isLoading ? (
    navigationValue === 'profile' ? (
      <ThemeProvider
        theme={isDarkTheme ? createTheme(dark) : createTheme(light)}
      >
        <Box
          sx={{
            backgroundColor: isDarkTheme ? '#121212' : '#fff',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Container component='main' sx={{ mt: 3, mb: 2 }} maxWidth='sm'>
            <Card>
              <CardContent>
                <Typography
                  variant='subtitle1'
                  component='div'
                  sx={{
                    flex: '0 0 auto',
                    marginRight: '5px',
                    color: '#707070',
                    fontSize: '1.1rem',
                    userSelect: 'none',
                  }}
                >
                  Logged in as
                </Typography>
                <Typography
                  variant='h3'
                  component='div'
                  sx={{ flex: '1 1 auto', userSelect: 'none' }}
                >
                  {user?.username}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    fontStyle: 'italic',
                    mt: 1,
                    textAlign: 'right',
                    userSelect: 'none',
                  }}
                >
                  ({user?.email})
                </Typography>
              </CardContent>
            </Card>

            {user?.canEnter === true ? (
              <Card
                sx={{
                  mt: 2,
                  backgroundColor: `${
                    isDarkTheme ? dark.canEnterBgColor : light.canEnterBgColor
                  }`,
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant='subtitle1'
                    sx={{ mt: 1, fontSize: '1.1rem', userSelect: 'none' }}
                  >
                    You <b>have</b> access to enter.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Card
                sx={{
                  mt: 2,
                  backgroundColor: `${
                    isDarkTheme ? dark.cantEnterBgColor : light.cantEnterBgColor
                  }`,
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant='subtitle1'
                    sx={{ mt: 1, fontSize: '1.1rem', userSelect: 'none' }}
                  >
                    You <b>do not have</b> access to enter.
                  </Typography>
                </CardContent>
              </Card>
            )}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ mt: 1 }}>
                    <Typography variant='h5' sx={{ userSelect: 'none' }}>
                      Dark mode
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <MaterialUISwitch
                      sx={{ mt: 1 }}
                      checked={checked}
                      onChange={handleSwitchChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ mt: 1 }}>
                    <Typography variant='h5' sx={{ userSelect: 'none' }}>
                      Sign out
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Button
                      variant='contained'
                      color='error'
                      endIcon={<LogoutIcon />}
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setUser(null);
                        signOut();
                      }}
                    >
                      Sign out
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Container>

          <BottomNavigationBar
            handleNavigationChange={handleNavigationChange}
            navigationValue={navigationValue}
            isAdmin={user?.isAdmin}
          />
        </Box>
      </ThemeProvider>
    ) : navigationValue === 'qr_access' ? (
      <ThemeProvider
        theme={isDarkTheme ? createTheme(dark) : createTheme(light)}
      >
        <QRPage user={user} />
        <BottomNavigationBar
          handleNavigationChange={handleNavigationChange}
          navigationValue={navigationValue}
          isAdmin={user?.isAdmin}
        />
      </ThemeProvider>
    ) : (
      <ThemeProvider
        theme={isDarkTheme ? createTheme(dark) : createTheme(light)}
      >
        <AdminPanel />
        <BottomNavigationBar
          handleNavigationChange={handleNavigationChange}
          navigationValue={navigationValue}
          isAdmin={user?.isAdmin}
        />
      </ThemeProvider>
    )
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

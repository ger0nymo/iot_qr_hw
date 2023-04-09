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

export default function HomePage() {
  const [isLoading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    getUserData();
  }, []);

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Container component='main' sx={{ mt: 8, mb: 2 }} maxWidth='sm'>
        <Typography variant='h2' component='h1' gutterBottom>
          Sticky footer
        </Typography>
        <Typography variant='h5' component='h2' gutterBottom>
          {'Pin a footer to the bottom of the viewport.'}
          {'The footer will move as the main element of the page grows.'}
        </Typography>
        <Typography variant='body1'>Sticky footer placeholder.</Typography>
      </Container>
      <Box
        component='footer'
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      ></Box>
    </Box>
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

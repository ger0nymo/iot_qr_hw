import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardContent,
  Card,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Avatar, ListItemAvatar } from '@mui/material';
import Switch from '@mui/material/Switch';
import PersonIcon from '@mui/icons-material/Person';
import { getAllUsers } from '../api/user';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { updateUserCanEnter, retrieveUser } from '../api/user';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export function AdminPanel() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(
    localStorage.getItem('isDarkTheme') === 'true' || false
  );
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function handleSwitchChange(id: string) {
    const sender = await retrieveUser();
    const toValue = !users.find((user) => user.id === id)?.canEnter;

    if (sender) {
      const result: any = await updateUserCanEnter(
        id,
        toValue,
        sender.username
      );
      if (result) {
        const newUsers = users.map((user) => {
          if (user.id === result.data.id) {
            return result.data;
          }
          return user;
        });
        setUsers(newUsers);
      }
    }
  }

  async function getUsers() {
    const result = await getAllUsers();
    if (result) {
      setUsers(result.data);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    getUsers();
  }, []);

  const light = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const dark = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const [dense, setDense] = React.useState(false);

  return (
    <ThemeProvider theme={isDarkTheme ? createTheme(dark) : createTheme(light)}>
      <Box
        sx={{
          backgroundColor: isDarkTheme ? '#121212' : '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Container component='main' sx={{ mb: 10 }} maxWidth='sm'>
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                color: isDarkTheme ? '#fff' : '#000',
                mt: 3,
                userSelect: 'none',
                textAlign: 'center',
              }}
              variant='h5'
              component='div'
            >
              Users
            </Typography>

            <List dense={dense} sx={{ textAlign: 'center' }}>
              {!loading ? (
                users.map((user) => (
                  <Card key={user.id} sx={{ mt: 1 }}>
                    <ListItem
                      secondaryAction={
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={user.canEnter}
                                onChange={() => handleSwitchChange(user.id)}
                              />
                            }
                            label={user.canEnter ? 'Can Enter' : 'Cannot Enter'}
                            labelPlacement='start'
                          />
                        </FormGroup>
                      }
                    >
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          color: isDarkTheme ? '#fff' : '#000',
                          userSelect: 'none',
                        }}
                        primary={user.username}
                        secondary={user.email}
                      />
                    </ListItem>
                  </Card>
                ))
              ) : (
                <CircularProgress />
              )}
            </List>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

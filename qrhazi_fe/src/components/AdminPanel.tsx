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
import { getAllUsers, retrieveCurrentToken } from '../api/user';
import { getAllLogs } from '../api/logs';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { updateUserCanEnter, retrieveUser } from '../api/user';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import StyledTableCell from '@mui/material/TableCell';
interface Log {
  username: string;
  date: string;
  id: string;
}

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export function AdminPanel() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(
    localStorage.getItem('isDarkTheme') === 'true' || false
  );
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [logsLoading, setLogsLoading] = React.useState(true);
  const [value, setValue] = React.useState(0);
  const [logs, setLogs] = React.useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = React.useState<Log[]>([]);
  const [searched, setSearched] = React.useState<string>('');

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
    if (result !== null) {
      setUsers(result.data);
    }
    setLoading(false);
  }

  async function getLogs() {
    const token = await retrieveCurrentToken();
    const result = await getAllLogs(token!);
    if (result) {
      const logs = result.data.map((log: any) => {
        return {
          username: log.username,
          date: log.date,
          id: log.id,
        };
      });
      setLogs(logs);
      setFilteredLogs(logs);
    }
    setLogsLoading(false);
  }

  function handleChange(event: React.SyntheticEvent, newValue: number) {
    setValue(newValue);
  }

  React.useEffect(() => {
    getUsers();
    getLogs();
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
      <AppBar position='fixed' color='default' elevation={2}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label='Users' />
          <Tab label='Logs' />
        </Tabs>
      </AppBar>
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
          {value === 0 ? (
            <Grid item xs={12} mt={8}>
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
                              label={
                                user.canEnter ? 'Can Enter' : 'Cannot Enter'
                              }
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
          ) : (
            <Paper sx={{ mt: 10 }}>
              <TextField
                fullWidth
                id='email'
                label='Search by user'
                name='username'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  setSearched(e.target.value);
                  const filtered = logs.filter((log) =>
                    log.username.startsWith(e.target.value)
                  );
                  console.log(filtered);
                  setFilteredLogs(filtered);
                }}
                value={searched}
              />
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table aria-label='Logs' stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        style={{
                          backgroundColor: isDarkTheme ? 'black' : 'lightgray',
                        }}
                      >
                        Username
                      </StyledTableCell>
                      <StyledTableCell
                        align='right'
                        style={{
                          backgroundColor: isDarkTheme ? 'black' : 'lightgray',
                        }}
                      >
                        Date
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!logsLoading ? (
                      filteredLogs.map((log) => (
                        <TableRow
                          key={log.id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component='th' scope='row'>
                            {log.username}
                          </TableCell>
                          <TableCell align='right'>{log.date}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

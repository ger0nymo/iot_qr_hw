import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Alert, Card, CardContent} from '@mui/material';
import QRCode from 'react-qr-code';
import { createQR } from '../api/qr';
import { retrieveCurrentToken } from '../api/user';
import Snackbar from "@mui/material/Snackbar";

export function QRPage(props: any) {
  const [isDarkTheme, setIsDarkTheme] = React.useState(
    localStorage.getItem('isDarkTheme') === 'true' || false
  );
  const [showQr, setShowQr] = React.useState(false);
  const [countdown, setCountdown] = React.useState(45);
  const [qrValue, setQrValue] = React.useState('');

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

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

  async function handleQrCreate(direction: boolean) {
    const token = retrieveCurrentToken();

    if (token) {
      try {
        const qr = await createQR(props.user.username, direction, token);
        if (qr) {
          setShowQr(true);
          const interval = setInterval(() => {
            setCountdown((countdown) => countdown - 1);
          }, 1000);
          setQrValue(qr.data['qrCode']);
          setTimeout(() => {
            clearInterval(interval);
            setShowQr(false);
            setCountdown(45);
          }, 45000);
        }
      } catch (error: any) {
        setSnackbarMessage(error.response.data['message']);
        setSnackbarOpen(true);
      }
    }
  }

  return (
    <ThemeProvider theme={isDarkTheme ? createTheme(dark) : createTheme(light)}>
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
            {props.user?.canEnter === true ? (
              showQr ? (
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ background: 'white', padding: '16px' }}>
                    <QRCode value={qrValue} />
                  </div>
                  <Typography
                    variant='h5'
                    component='div'
                    sx={{
                      mt: 3,
                      userSelect: 'none',
                      textAlign: 'center',
                    }}
                  >
                    Scan the QR code to open the door.
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      mt: 2,
                      textAlign: 'center',
                      userSelect: 'none',
                    }}
                  >
                    The QR code will expire in <b>{countdown}</b> seconds.
                  </Typography>
                </CardContent>
              ) : (
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    variant='h6'
                    component='div'
                    sx={{
                      flex: '1 1 auto',
                      mb: 3,
                      userSelect: 'none',
                      textAlign: 'center',
                    }}
                  >
                    Press the button to generate a QR code for entering or
                    leaving.
                  </Typography>
                  <Button
                    color='success'
                    variant='contained'
                    onClick={() => handleQrCreate(true)}
                    sx={{ width: '50%', margin: '0 auto'}}
                  >
                    Enter gate
                  </Button>
                  <Button
                      color='success'
                      variant='contained'
                      onClick={() => handleQrCreate(false)}
                      sx={{ width: '50%', margin: '0 auto', mt: 2 }}
                  >
                    Exit gate
                  </Button>
                  <Snackbar
                      open={snackbarOpen}
                      autoHideDuration={2500}
                      onClose={() => setSnackbarOpen(false)}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <Alert severity='error'>
                      {snackbarMessage}
                    </Alert>
                  </Snackbar>
                </CardContent>
              )
            ) : (
              <CardContent sx={{ justifyContent: 'center' }}>
                <Typography
                  variant='h1'
                  component='div'
                  sx={{
                    flex: '1 1 auto',
                    userSelect: 'none',
                    textAlign: 'center',
                  }}
                >
                  :(
                </Typography>
                <Typography
                  variant='h5'
                  component='div'
                  sx={{
                    mt: 3,
                    userSelect: 'none',
                    textAlign: 'center',
                  }}
                >
                  You are not allowed to enter.
                </Typography>
              </CardContent>
            )}
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

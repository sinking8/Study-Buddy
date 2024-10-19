import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >

          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Study&nbsp;Smarter&nbsp;
          </Typography>
            
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'clamp(3.2rem, 11vw, 3.6rem)',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              Not&nbsp;Harder
            </Typography>
        </Stack>
        <Grid container useFlexGap mt={3} gap={2} sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }} >
          <Grid item>
            <Card>
              <CardContent align='center' justifyContent='center' p={4}>
                <Typography variant="h5" align='center' >Gameify</Typography>
                <Divider />
                <Typography align='center'>Earn points and badges as you complete tasks and quizzes.</Typography>
                <Button mt={3} variant='contained' color='primary'>Get Started</Button>
                </CardContent>
            </Card>
          </Grid>
          <Grid item>
          <Card>
              <CardContent>
                <Typography variant="h5" align='center' justifyContent='center'>Listen on the Go</Typography>
                <Divider />
                Earn points and badges as you complete tasks and quizzes.
                </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

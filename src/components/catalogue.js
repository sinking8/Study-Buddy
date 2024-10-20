import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import AppAppBar from './AppAppBar';
import Footer from './Footer';

import { useNavigate } from "react-router-dom";

const gameCards = [
  {
    gameName: 'Slither and Solve',
    previewImage: 'https://via.placeholder.com/400x300.png?text=Game+One+Preview',
    navigate_url : '/snake',
    description: 'Get ready to chow down! In this classic snake game, you’ll munch on deliciously wrong answers. Gobble the right one, and you’re a genius! Miss the mark, and it’s game over—don’t let the snake starve!'
  },
  {
    gameName: 'Flip & Match Fiesta',
    previewImage: 'https://via.placeholder.com/400x300.png?text=Game+Two+Preview',
    navigate_url : '/memory',
    description: "Put your memory to the test! Flip tiles to match definitions with their words. Can you keep your brain from flipping out, or will you just end up with a bunch of mismatched tiles?",
  },
  {
    gameName: 'Organize This',
    navigate_url : '/connections',
    previewImage: 'https://via.placeholder.com/400x300.png?text=Game+Three+Preview',
    description: 'Time to show off your organizing skills! Word tiles are thrown into chaos, and it’s up to you to categorize them before they start a rebellion. Can you reign in the vocabulary?',
  },
  {
    gameName: 'Game Three',
    navigate_url : '/snake',
    previewImage: 'https://via.placeholder.com/400x300.png?text=Game+Three+Preview',
    description: 'Game Three is a fast-paced, action-packed shooter where you fight through hordes of enemies in stunning environments, equipped with futuristic weapons and abilities.',
  },
  {
    gameName: 'Game Three',
    navigate_url : '/snake',
    previewImage: 'https://via.placeholder.com/400x300.png?text=Game+Three+Preview',
    description: 'Game Three is a fast-paced, action-packed shooter where you fight through hordes of enemies in stunning environments, equipped with futuristic weapons and abilities.',
  },

];

export default function GameCatalogue() {
  const theme = useTheme();
  let navigate = useNavigate();

  return (
    <>
      <AppAppBar />
      <Container
        id="game-cards"
        sx={{
          mt: { xs: 30, sm: 102 },
          pt: { xs: 4, sm: 8 },
          pb: { xs: 8, sm: 16 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 5, sm: 6 },
        }}
      >
        <Grid container spacing={4}>
          {gameCards.map((game, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
              <Card
                variant="outlined"
                onClick={()=>{navigate(game.navigate_url)}}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardHeader
                  title={game.gameName}
                  sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={game.previewImage}
                  alt={`${game.gameName} Preview`}
                  sx={{
                    opacity: 0.85,
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', textAlign: 'center', mb: 1 }}
                  >
                    {game.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

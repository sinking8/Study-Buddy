import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import { useNavigate } from "react-router-dom";
import { useState
  , useEffect
 } from 'react';

import axios from 'axios';

import snake_img from '../assets/snake.jpg';
import memory_img from '../assets/flip.jpg';
import match_img from '../assets/memory.jpg';
import random_img from '../assets/random.jpg';
import preview_img from '../assets/preview.jpg';

import AppAppBar from './AppAppBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getMPTheme from '../theme/getMPTheme';

const gameCards = [
  {
    gameName: 'Slither and Solve',
    previewImage: snake_img,
    navigate_url: '/snake',
    description: 'Get ready to chow down! In this classic snake game, you’ll munch on deliciously wrong answers. Gobble the right one, and you’re a genius!',
  },
  {
    gameName: 'Flip & Match Fiesta',
    previewImage: match_img,
    navigate_url: '/memory',
    description: "Put your memory to the test! Flip tiles to match definitions with their words. Can you keep your brain from flipping out, or will you just end up with a bunch of mismatched tiles?",
  },
  {
    gameName: 'Organize This',
    navigate_url: '/connections',
    previewImage: memory_img,
    description: 'Time to show off your organizing skills! Word tiles are thrown into chaos, and it’s up to you to categorize them before they start a rebellion. Can you reign in the vocabulary?',
  },
  {
    gameName: 'Random',
    navigate_url: Math.floor(Math.random() * (100 - 2 + 1) + 2) % 2 === 0 ? '/snake' : '/memory',
    previewImage: random_img,
    description: 'This is the randomizer! You will be faced with a random game. Good luck!',
  },
];

export default function GameCatalogue() {
  const theme = useTheme();
  const MPTheme = createTheme(getMPTheme('light'));
  let navigate = useNavigate();
  const [audioSrc, setAudioSrc] = useState("");

  let session_id = localStorage.getItem("session_id");

  useEffect(() => {
    // Fetch the audio data when the component mounts
    const fetchAudio = () => {
      axios
        .get(`http://localhost:8000/get_summarized_audio`, {
          params: {
            session_id: session_id, // Replace YOUR_SESSION_ID as needed
          },
        })
        .then((response) => {
          console.log(response.data);
    
          if (response.data.status) {
            // Set the audio source to the base64 data
            setAudioSrc(`data:audio/wav;base64,${response.data.response}`);
          } else {
            console.error("Error fetching audio:", response.data.response);
          }
        })
        .catch((error) => {
          console.error("Axios error:", error);
        });
    };
    
    fetchAudio();
  }, []); // Empty dependency array to run only on mount

  return (
    <ThemeProvider theme={MPTheme}>
      <AppAppBar />
      <Container
        id="game-cards"
        sx={{
          mt: { xs: 30, sm: 102 },
          pt: { xs: 4, sm: 8 },
          pb: { xs: 8, sm: 16 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 5, sm: 6 },
        }}
      >
        {/* Audio Player Card */}
        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            mt: 20,
            borderRadius: 2,
            boxShadow: 5,
            backgroundColor: "white",
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
            },
            padding: theme.spacing(2),
            color: "white",
          }}
        >
          <CardHeader
            title="VIBE"
            sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem' }}
          />
          <CardMedia
            component="img"
            height="140"
            image={preview_img}
            alt="Audio Player Preview"
            sx={{ borderRadius: 1 }}
          />
          <CardContent>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', mb: 2 }}
            >
              Enjoy a relaxing audio experience! Click play to listen to a sample track and immerse yourself in the sound.
            </Typography>
            {audioSrc && (
              <audio controls style={{ width: '100%' }} autoPlay>
                <source src={audioSrc} type="audio/wav" />
                Your browser does not support the audio tag.
              </audio>
            )}
          </CardContent>
        </Card>

        {/* Game Cards Grid */}
        <Grid container spacing={4}>
          {gameCards.map((game, index) => (
            <Grid item xs={10} sm={2} md={4} key={index}>
              <Card
                variant="outlined"
                onClick={() => {
                  if (game.navigate_url) {
                    navigate(game.navigate_url);
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  boxShadow: 5,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 8,
                  },
                }}
              >
                <CardHeader
                  title={game.gameName}
                  sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    color: "black",
                    borderBottom: `2px solid ${"white"}`,
                  }}
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={game.previewImage}
                  alt={`${game.gameName} Preview`}
                  sx={{
                    borderRadius: '0 0 8px 8px',
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
    </ThemeProvider>
  );
}

import React, { useState, useEffect } from 'react';
import './styles/memory.css'; // Separate your styles into a CSS file
import axios from 'axios';

const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState(0);
    const [cardsArray, setCardsArray] = useState([]);
    const [hashmap, setHashMap] = useState({});

    const session_id = localStorage.getItem("session_id");

    useEffect(() => {
        // Fetch data from API
        axios.get(`http://localhost:8000/get_match_questions?session_id=${session_id}`, {
            headers: {
                'accept': 'application/json',
            },
        })
        .then((response) => {
            console.log('Data fetched: ', response.data);
            const pairs = response.data.response;
            const new_hash = {};

            for (let i = 0; i < pairs.length; i++) {
                new_hash[pairs[i][0]] = pairs[i][1];
                new_hash[pairs[i][1]] = pairs[i][0];
            }

            setHashMap(new_hash);
            setCardsArray(pairs.flat());
            initializeGame(pairs.flat());  // Initialize game with fetched pairs
        })
        .catch((error) => {
            console.error('Error fetching data: ', error);
        });
    }, []);

    // Shuffle function
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // Initialize the game board
    const initializeGame = (cardsArray) => {
        const shuffledCards = [...cardsArray];
        shuffle(shuffledCards);
        setCards(shuffledCards.map((value, index) => ({
            value,
            id: index,
            flipped: false,
            matched: false
        })));
        setFlippedCards([]);
        setMatchedCards(0);
    };

    // Handle card click
    const handleCardClick = (id) => {
        const newCards = cards.map(card =>
            card.id === id && !card.flipped && !card.matched
                ? { ...card, flipped: true }
                : card
        );

        setCards(newCards);

        const newFlippedCards = newCards.filter(card => card.flipped && !card.matched);
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            checkForMatch(newFlippedCards);
        }
    };

    // Check if the two flipped cards match
    const checkForMatch = (flipped) => {
        const [card1, card2] = flipped;

        // Check for a match
        if (hashmap[card1.value] === card2.value) {
            setCards(prevCards =>
                prevCards.map(card =>
                    card.value === card1.value || card.value === card2.value
                        ? { ...card, matched: true }
                        : card
                )
            );
            setMatchedCards(prevMatchedCards => prevMatchedCards + 2);
        } else {
            setTimeout(() => {
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.id === card1.id || card.id === card2.id
                            ? { ...card, flipped: false }
                            : card
                    )
                );
            }, 1000);
        }

        setFlippedCards([]); // Reset flipped cards after checking
    };

    // Check if the player has matched all cards
    useEffect(() => {
        if (matchedCards === cardsArray.length) {
            setTimeout(() => {
                alert('Congratulations! You matched all the cards!');
                initializeGame(cardsArray); // Re-initialize game with the same pairs
            }, 500);
        }
    }, [matchedCards, cardsArray]); // Add cardsArray as a dependency

    return (
        <div className="memory-game">
            <h1>Memory Matching Game</h1>
            <div id="game-board">
                {cards.map(card => (
                    <div
                        key={card.id}
                        className={`card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                        onClick={() => handleCardClick(card.id)}
                        style={{ padding: '0px', margin: '1px', width: '100px', height: '100px',fontSize: '10px',justifyContent: 'center', alignItems: 'center' }}
                    >
                        {card.flipped || card.matched ? card.value : ''}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemoryGame;

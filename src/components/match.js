import React, { useEffect, useState } from 'react';
import './styles/connections.css'; // You can keep the CSS styles in a separate file
import axios from 'axios';

const ConnectionsGame = () => {
    const [correctMatches, setCorrectMatches] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [categories,setCategories] = useState([]);
    const totalMatches = 6; // Total number of draggable items

    // fetch from API and get answersData

    let session_id = localStorage.getItem("session_id");

    useEffect(() => {

        // axios get call to fetch data from API
        axios.get(`http://localhost:8000/get_connections?session_id=${session_id}`, {
            headers: {
                'accept': 'application/json',
            },
        })
        .then((response) => {
            console.log('Data fetched: ', response.data);
            setAnswers(response.data.response);

            let categories = [];
            response.data.response.map((item) => {
                if(!categories.includes(item.category)){
                    categories.push(item.category);
                }
            });
            // Remove duplicate cateogories
            // Shuffle cards array
            const shuffle = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            };
        })
        .catch((error) => {
            console.error('Error fetching data: ', error);
        });
    }, []);

    const dragStart = (e, id) => {
        e.dataTransfer.setData('text/plain', id);
    };

    const dragOver = (e) => {
        e.preventDefault();
    };

    const drop = (e, category) => {
        e.preventDefault();
        const draggedAnswerId = e.dataTransfer.getData('text/plain');
        const draggedAnswer = answers.find(answer => answer.id === draggedAnswerId);
        
        if (draggedAnswer && draggedAnswer.category === category) {
            setAnswers(prevAnswers => 
                prevAnswers.map(answer => 
                    answer.id === draggedAnswerId ? { ...answer, isCorrect: true } : answer
                )
            );
            setCorrectMatches(prevCount => prevCount + 1);
        } else {
            alert('Incorrect match! Try again.');
        }
    };

    const checkCompletion = () => {
        if (correctMatches === totalMatches) {
            return 'Congratulations! All answers are categorized correctly!';
        }
        return '';
    };

    return (
        <div style={{ textAlign: 'center', backgroundColor: '#f4f4f9', padding: '20px', marginTop:'50px' }}>
            <h1>Connections Game - Categorize the Answers!</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '30px' }}>
                {categories.map(category => (
                    <div key={category} style={{ width: '200px', padding: '20px', backgroundColor: '#3498db', borderRadius: '8px', color: '#fff', marginBottom: '20px' }}>
                        <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                        <div 
                            style={{ minHeight: '100px', border: '2px dashed #ecf0f1', borderRadius: '8px', padding: '10px' }} 
                            onDragOver={dragOver}
                            onDrop={(e) => drop(e, category)}
                        >
                            {answers.filter(answer => answer.isCorrect).map(answer => answer.category === category && (
                                <div key={answer.id} style={{ padding: '10px', margin: '10px', borderRadius: '5px', backgroundColor: '#2ecc71', color: '#fff' }}>
                                    {answer.label}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ margin: '20px', padding: '20px', border: '2px solid #ecf0f1', backgroundColor: '#ecf0f1', borderRadius: '8px', maxWidth: '900px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {answers.map(answer => (
                    !answer.isCorrect && (
                        <div 
                            key={answer.id} 
                            draggable 
                            onDragStart={(e) => dragStart(e, answer.id)} 
                            style={{ backgroundColor: '#f1c40f', padding: '10px', margin: '10px', borderRadius: '5px', color: '#fff', cursor: 'grab' }}
                        >
                            {answer.label}
                        </div>
                    )
                ))}
            </div>

            <div id="result" style={{ marginTop: '20px', fontSize: '1.5em' }}>
                {checkCompletion()}
            </div>
        </div>
    );
};

export default ConnectionsGame;

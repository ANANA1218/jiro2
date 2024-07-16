import React, { useState } from 'react';
import Column from './Column';
import { Container, Grid } from '@mui/material';
import './Board.css';

const Board = () => {
  const [lanes, setLanes] = useState([
    {
      id: 'lane1',
      title: 'Planned Tasks',
      label: '2/2',
      cards: [
        { id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins' },
        { id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins' }
      ]
    },
    {
      id: 'lane3',
      title: 'Work in progress',
      label: '1/1',
      cards: [
        { id: 'Card3', title: 'Clean house', description: 'Clean house (bath, living room, kitchen)', label: '30 mins' }
      ]
    },
    {
      id: 'lane2',
      title: 'Completed',
      label: '1/1',
      cards: [
        { id: 'Card4', title: 'Buy a cup of tea', description: 'Herbal tea', label: '30 mins' }
      ]
    }
  ]);

  const handleDragStart = (e, cardId, laneId) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('laneId', laneId);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetLaneId) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const sourceLaneId = e.dataTransfer.getData('laneId');

    if (sourceLaneId !== targetLaneId) {
      const sourceLaneIndex = lanes.findIndex(lane => lane.id === sourceLaneId);
      const targetLaneIndex = lanes.findIndex(lane => lane.id === targetLaneId);
      const cardIndex = lanes[sourceLaneIndex].cards.findIndex(card => card.id === cardId);
      const card = lanes[sourceLaneIndex].cards.splice(cardIndex, 1)[0];
      lanes[targetLaneIndex].cards.push(card);
      setLanes([...lanes]);
    }
  };

  return (
    <Container maxWidth="lg" className="container">
      <Grid container spacing={3}>
        {lanes.map(lane => (
          <Grid item xs={4} key={lane.id}>
            <Column
              lane={lane}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Board;

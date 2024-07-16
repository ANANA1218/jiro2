import React from 'react';
import Card from './Card';
import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material';
import './Column.css';

const Column = ({ lane, handleDragOver, handleDrop, handleDragStart }) => {
  return (
    <MuiCard className="column-card" style={{ padding: '1rem', backgroundColor: '#F0F4F8' }}>
      <CardContent>
        <Typography variant="h6">{lane.title}</Typography>
        <Typography variant="subtitle1" color="textSecondary">{lane.label}</Typography>
        <Box
          className="list-group"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, lane.id)}
          sx={{ mt: 2 }}
        >
          {lane.cards.map(card => (
            <Card key={card.id} card={card} handleDragStart={(e, cardId) => handleDragStart(e, cardId, lane.id)} />
          ))}
        </Box>
      </CardContent>
    </MuiCard>
  );
};

export default Column;

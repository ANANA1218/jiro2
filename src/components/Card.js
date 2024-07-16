import React from 'react';
import { Card as MuiCard, CardContent, Typography } from '@mui/material';
import './Card.css';

const Card = ({ card, handleDragStart }) => {
  return (
    <MuiCard
      className="card-item"
      draggable
      onDragStart={(e) => handleDragStart(e, card.id)}
      sx={{ mb: 2, cursor: 'pointer', backgroundColor: '#ffffff' }}
    >
      <CardContent>
        <Typography variant="h6">{card.title}</Typography>
        <Typography variant="body2" color="textSecondary">{card.description}</Typography>
        <Typography variant="caption" color="textSecondary">{card.label}</Typography>
      </CardContent>
    </MuiCard>
  );
};

export default Card;

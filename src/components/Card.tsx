import { Card as CardType } from '../types/game';
import './Card.css';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export const Card = ({ card, onClick }: CardProps) => {
  const { isFlipped, isMatched, value } = card;
  
  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <span>?</span>
        </div>
        <div className="card-back">
          <span>{value}</span>
        </div>
      </div>
    </div>
  );
}; 
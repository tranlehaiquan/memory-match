import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export const Card = ({ card, onClick }: CardProps) => {
  const cardClasses = `
    w-[100px] h-[100px] perspective-1000 cursor-pointer m-2.5
    ${card.isFlipped ? 'flipped' : ''}
    ${card.isMatched ? 'matched' : ''}
  `;

  const innerClasses = `
    relative w-full h-full text-center transition-transform duration-600
    transform-style-3d
    ${card.isFlipped ? 'rotate-y-180' : ''}
  `;

  const frontClasses = `
    absolute w-full h-full backface-hidden flex items-center justify-center
    rounded-lg text-2xl font-bold bg-blue-500 text-white
  `;

  const backClasses = `
    absolute w-full h-full backface-hidden flex items-center justify-center
    rounded-lg text-2xl font-bold bg-green-500 text-white rotate-y-180
    ${card.isMatched ? 'bg-green-400' : ''}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className={innerClasses}>
        <div className={frontClasses}>?</div>
        <div className={backClasses}>{card.value}</div>
      </div>
    </div>
  );
}; 
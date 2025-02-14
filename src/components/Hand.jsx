import CardComponent from './CardComponent'
import calculateMoves, { setCurrMarble } from '../utils/Play';
import { UpdateMarbles } from '../utils/GameSetup';
import { Flex } from '@chakra-ui/react';

export default function Hand({currHand, currTurn, onCardClick, marbles, currPlayer}) {
   const cards = [];

   let atLeastOnePlayable = false;

   for (const card of currHand) {
      const cardRank = card.getRank();

      card.isPlayable = isPlayable(cardRank, marbles, currPlayer); // TODO - this seems dangerous. Is there a way to code this safer?

      atLeastOnePlayable = atLeastOnePlayable || (card.isPlayable && cardRank !== "J"); // TODO - refactor this logic into a function
   }

   const perCardRotation = 90/currHand.length;

   for (const [index, card] of currHand.entries()) {
      if (card) {
         const playable = currTurn && (card.isPlayable || !atLeastOnePlayable);

         const cardRotation = (index * perCardRotation) - 45 + (parseFloat(perCardRotation) / 2);
         const cardTranslation = (0.03 * Math.pow(cardRotation, 2));

         cards.push(
            <CardComponent 
               key={index} 
               card={card} 
               currTurn={currTurn} 
               onClick={onCardClick} 
               playable={playable}
               width={119}
               style={{
                  marginLeft: index > 0 ? '-80px' : '0',  // Overlap cards
                  transform: `rotate(${cardRotation}deg) translateY(${cardTranslation}px)`,  // Fan out cards
                  transformOrigin: 'bottom center',
               }}
            />
         );
      }
   }

   return (
      <Flex 
         className='hand'
         justifyContent="center"
         alignItems="center"
         width="100%"
         height="100%"
      >
         {cards}
      </Flex>
   )
}

function isPlayable(cardRank, marbles, currPlayer) {
   const currMarbleToMove = setCurrMarble(currPlayer, marbles[currPlayer]);

   return calculateMoves(cardRank, currMarbleToMove, marbles, UpdateMarbles.NO) > 0;
}
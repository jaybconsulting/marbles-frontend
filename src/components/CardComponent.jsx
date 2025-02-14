import { Image } from "@chakra-ui/react";
import PropTypes from 'prop-types';

export default function CardComponent({
   card, 
   currTurn, 
   onClick, 
   playable, 
   style,
   width
}) {
   function getCardStr(card) {
      if (!card) return;

      const cardPath = '../assets/cards/';

      if (!currTurn) {
         return new URL(`${cardPath}CARD-BACK-1.svg`, import.meta.url).href;
      } 

      if (card.getRank() === "R") {
         return new URL(`${cardPath}JOKER-${card.getSuit() === "B" ? "1" : "3"}.svg`, import.meta.url).href;
      }

      const imgRank = (rank) => {
         switch(rank) {
            case "J": return "11-JACK";
            case "Q": return "12-QUEEN";
            case "K": return "13-KING";
            case "A": return "1";
            default: return rank;
         }
      }

      const imgSuit = (suit) => {
         switch(suit) {
            case "C": return "CLUB";
            case "D": return "DIAMOND";
            case "H": return "HEART";
            case "S": return "SPADE";
            default: return suit;
         }
      }

      return currTurn ? 
         new URL(`${cardPath}${imgSuit(card.getSuit())}-${imgRank(card.getRank())}.svg`, import.meta.url).href :
         new URL(`${cardPath}CARD-BACK-1.svg`, import.meta.url).href;
   }
   
   const cardStr = getCardStr(card);
   
   return (
      <Image 
         src={cardStr}
         alt={cardStr}
         width={width}
         height={width * 169/119}
         onClick={() => {
            if (!currTurn || !playable) return;
            onClick(card);
         }}
         border="1px solid gray"
         borderRadius="10px"
         style={{
            ...style,
            filter: currTurn && !playable ? 'brightness(0.75) contrast(0.5)' : 'none',
         }}
      />
   )
}

CardComponent.propTypes = {
   card: PropTypes.object,
   currTurn: PropTypes.bool,
   onClick: PropTypes.func,
   playable: PropTypes.bool,
   style: PropTypes.object,
   width: PropTypes.number
 };
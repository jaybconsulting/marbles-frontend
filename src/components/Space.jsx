import { boardSpaceSize } from '../utils/constants';

function Space({type, number, colour, marbleColour, disabled, onClick}) {

   let spaceColour = null;

   if (type === `home-playing-space` || type === `home-start` || type === `home-end`) {
      spaceColour = colour;
   }

   if (marbleColour) {
      spaceColour = marbleColour;
   }

   const classNameVar = `board-space ${spaceColour}`;

   const returnComponent = disabled ?
      <div 
         className={classNameVar} 
         style={
            {
               height: boardSpaceSize, 
               width: boardSpaceSize,
               color: 'black'
            }
         }
      >
         {number}
      </div> :
      <button 
         className={classNameVar + ` enabled`} 
         onClick={onClick}
         style={{height: boardSpaceSize, width: boardSpaceSize}}
      >
         {number}
      </button> 
      ;

   return returnComponent;
}

export default Space;
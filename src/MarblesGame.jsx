import { useState, useRef, useEffect } from 'react';
import './styles.css';
import Board, { getHomeStartLocations, allMarblesInEndHome, getNumSpacesBetween, getAllPlayingPositionsInRange } from './components/Board'
import calculateMoves, { playRemainderOfCard, setCurrMarble } from './utils/Play'
import { 
  players, 
  getNextPlayer, 
  getTeammate, 
  areOnOpposingTeams, 
  UpdateMarbles, 
  initialMarbles, 
  initialHands,
  extraCardPlayedImmediatelyForRedJoker,
  extraCardPlayedImmediatelyForBlackJoker,
  dealingSequence
} from './utils/GameSetup'
import { areEqual } from './components/Marble'
import Card, { areEqualCards } from './utils/Card'
import Hand from './components/Hand'
import Deck from './components/Deck'
import { Box, Flex, HStack, VStack } from '@chakra-ui/react';

// Task list:
// - Fix the bug where a 7 is showing as playable for yellow when they have 1 marble on the board and it's 6 spaces away from the last end home space
// - make it easy to know which hand belongs to which colour player - maybe add an Avatar next to the hand
// - set up multiplayer online
  // - use Next.js or Vite to handle routing, auth, etc.?
  // - implement a backend (Supabase or Firebase?)
// - the marbles look a little smaller than the open spaces
// - create test cases
// - standardize the use of "colour" and "player" in all names
// - standardize the use of "boardPosition", "space", or whatever else I used
// - can I add some sort of data structure or something to iterate through all marbles? so I'm not constantly writing 2 for loops
// - if there's only one possible move, just make it automatically instead of making the player do it
// - create a home screen where user can select rules (i.e., which colour starts, what to with jokers)
// - make it hosted online and allow multiplayer
// - refactor code to Typescript
// - refactor code to use clsx for conditional classNames

function MarblesGame() {

  const [marbles, setMarbles]     = useState({...initialMarbles});
  const [hands, setHands]         = useState({...initialHands});
  const [winner, setWinner]       = useState(null);

  const [lastCardPlayed, setLastCardPlayed] = useState(null);

  const player              = useRef("green"); // should be used for anything specific to a player, regardless of whether they're playing their teammates marbles or not
  const currMarble          = useRef(setCurrMarble(player.current, marbles[player.current])); // should be used for the marbles that currPlayer is operating on
  const deck                = useRef(new Deck());
  const dealNum             = useRef(0);
  const dealer              = useRef("yellow");
  const selectedMarble      = useRef(null);
  const playedCard          = useRef(null);
  const spacesLeftIn7       = useRef(0); // TODO - refactor this. Shouldn't be this dependency bt playedCard and spacesLeftIn7
  const disableOtherMarbles = useRef(false);

  useEffect(() => {
    currMarble.current = setCurrMarble(player.current, marbles[player.current]);
  }, [marbles]);
  
  function startGame() {
    setMarbles(initialMarbles);
    setHands({...initialHands});
    setWinner(null);
    resetDealAndDeck("yellow");
    dealCards();
  }

  /* FOR TESTING PURPOSES */
  function implementTest() {
    marbles["yellow"][1].row = 0;
    marbles["yellow"][1].col = 7;

    setMarbles({...marbles});

    hands["yellow"][0] = new Card("7", "S");

    setHands({...hands});
  }
  /* FOR TESTING PURPOSES */

  function onCardClick(card) {
    playCard(card);
  }

  function playCard(card) {
    playedCard.current = card;
    setLastCardPlayed(card);
    
    if (card.isPlayable) {
      const cardRank = card.getRank();

      if (cardRank === "7") spacesLeftIn7.current = 7;

      calculateMoves(cardRank, currMarble.current, marbles, UpdateMarbles.YES);

      removeCardFromHand(card, hands[player.current]);

      setMarbles({ ...marbles });
    }
    else {
      removeCardFromHand(card, hands[player.current]);

      prepareNextTurn();
    }
  }

  function onMarbleClick(marble) {
    for (const updatedMarble of marbles[marble.colour]) {
      if (areEqual(updatedMarble, marble)) {
        if (isCurrCardJack()) {
          if (selectingFirstMarbleForJack()) {
            selectedMarble.current = marble;
            
            resetWhereCanMoveLocationsForThisColour(marble.colour);
          }
          else { // selecting second marble
            swapCurrentMarbleWith(marble);

            prepareNextTurn();
          }
        }
        else if (selectedMarble.current === null) {
          updateMarblesBasedOnWhereCanMovePositions(updatedMarble);
        }
        else { // when marble played with a 7 clicks on a marble to kill it
          const newPosition = [marble.row, marble.col];

          killMarble(marble, marbles);

          marble.isInPathOfOpposingTeams7 = false;

          moveMarbleToPositionWith7(newPosition);
        }

        break;
      }
    }

    checkForWinner();

    setMarbles({...marbles});
  }

  function resetWhereCanMoveLocationsForThisColour(colour) {
    for (const marble of marbles[colour]) {
      marble.whereCanMove = [];
    }
  }

  function onBoardPositionClick(newPosition) {
    moveMarbleToPositionWith7(newPosition);
  }

  function moveMarbleToPositionWith7(position) {
    const oldPosition = [selectedMarble.current.row, selectedMarble.current.col];

    selectedMarble.current.row = position[0];
    selectedMarble.current.col = position[1];

    killAllOpposingMarblesBetweenPositions(oldPosition, position, currMarble.current, marbles);

    spacesLeftIn7.current -= getNumSpacesBetween(oldPosition, position, currMarble.current);

    resetWhereCanMoveLocations();

    selectedMarble.current = null;
    disableOtherMarbles.current = false;

    currMarble.current = setCurrMarble(player.current, marbles[player.current]);

    // TODO: ASSERT (spacesLeftIn7.current >= 0);

    if (spacesLeftIn7.current > 0) {
      const isCardPlayable = playRemainderOfCard(spacesLeftIn7.current, currMarble.current, marbles);
      
      if (isCardPlayable) {
        setMarbles({...marbles});
      }
      else {
        prepareNextTurn();
      }
    }
    else {
      prepareNextTurn();

      setMarbles({...marbles});
    }
  }

  function isCurrCardJack() {
    return playedCard.current.getRank() === "J";
  }

  function swapCurrentMarbleWith(marble) {
    const tempPosition = [marble.row, marble.col];
    [marble.row, marble.col] = [selectedMarble.current.row, selectedMarble.current.col];
    [selectedMarble.current.row, selectedMarble.current.col] = tempPosition;
  }

  function resetDealAndDeck(newDealer) {
    setNewDealer(newDealer);
    createDeck();
  }

  function setNewDealer(newDealer) {
    dealer.current = newDealer;
    player.current = getNextPlayer(newDealer);

    dealNum.current = 0;
  }

  function createDeck() {
    deck.current = new Deck();
    deck.current.shuffle();
  }

  function setDealingParameters() {
    if (dealNum.current === dealingSequence.length - 1) {
      resetDealAndDeck(getNextPlayer(dealer.current));
    }
    else {
      dealNum.current += 1;
    }
  }

  function dealCards() {
    for (let i = 0; i < dealingSequence[dealNum.current]; i++) {
      let playerToGetCard = player.current;
      do {
        hands[playerToGetCard].push(deck.current.dealCard());
        playerToGetCard = getNextPlayer(playerToGetCard);
      } while (playerToGetCard !== player.current);
    }

    setHands({...hands});
  }

  function updateMarblesBasedOnWhereCanMovePositions (marble) {
    if (marble.whereCanMove.length === 1 && playedCard.current.getRank() !== "7") {
      const [newRow, newCol] = marble.whereCanMove[0];
 
      marble.row = newRow;
      marble.col = newCol;

      killOpposingMarbleInBoardPosition(marble.whereCanMove[0], marble.colour);

      resetWhereCanMoveLocations();

      prepareNextTurn();
    }
    else { // marble can move to multiple different locations
      marble.allowUserToSelectWhereCanMove = true;

      selectedMarble.current               = marble;

      disableOtherMarbles.current          = true;

      updateOpposingMarblesInPath(marble.whereCanMove);
    }
  }

  function updateOpposingMarblesInPath(path) {
    for (const boardPosition of path) {
      for (const marblePlayer of players) {
        for (const marble of marbles[marblePlayer]) {
          if (areOnOpposingTeams(currMarble.current, marblePlayer) && isMarbleInBoardPosition(marble, boardPosition)) {
            marble.isInPathOfOpposingTeams7 = true;
          }
        }
      }
    }
  }
 
  function killOpposingMarbleInBoardPosition(boardPosition, currPlayer) {
    for (const marblePlayer of players) {
      if (areOnOpposingTeams(marblePlayer, currPlayer)) {
        for (const marble of marbles[marblePlayer]) {
          if (isMarbleInBoardPosition(marble, boardPosition)) {
            killMarble(marble, marbles);
          }
        }
      }
    }
  }

  function killMarble(marble, marbles) {
    const homeStartLocation = getNextAvailableHomeStartLocation(marble.colour, marbles);
  
    marble.row = homeStartLocation[0];
    marble.col = homeStartLocation[1];

    marble.isInPathOfOpposingTeams7 = false;
  }

  function killAllOpposingMarblesBetweenPositions(startPosition, endPosition, currPlayer) {
    const boardPositions = getAllPlayingPositionsInRange(startPosition, endPosition, currPlayer);

    for (const boardPosition of boardPositions) {
      killOpposingMarbleInBoardPosition(boardPosition, currPlayer);
    }
  }

  function resetWhereCanMoveLocations() {
    for (const player of players) {
       for (const marble of marbles[player]) {
          marble.whereCanMove = [];
          marble.allowUserToSelectWhereCanMove = false;
       }
    }
 }
  
  function isMarbleInBoardPosition(marble, boardPosition) {
    return marble.row === boardPosition[0] && marble.col === boardPosition[1];
  }
  
  function getNextAvailableHomeStartLocation(currPlayer) {
    const homeStartLocations = getHomeStartLocations(currPlayer);
  
    for (const homeStartLocation of homeStartLocations) {
      let isLocationOccupied = false;
  
      for (const marble of marbles[currPlayer]) {
        if (marble.row === homeStartLocation[0] && marble.col === homeStartLocation[1]) {
          isLocationOccupied = true;
          break;
        }
      }
  
      if (!isLocationOccupied) return homeStartLocation;
    }
  
    // return error
  }

  function removeCardFromHand(card, hand) {
    let index = 0; // TODO - figure out the syntax in the for loop to get the index (i.e., something like "for (let [handCard, index] of hand) {}")
    
    for (let handCard of hand) {
      if (handCard && areEqualCards(card, handCard)) {
        hand.splice(index, 1);
        break;
      }
      index++;
    }

    setHands({ ...hands });
  }

  function setNextPlayer() {
    player.current     = getNextPlayer(player.current);
    
    currMarble.current = setCurrMarble(player.current, marbles[player.current]);
  }

  function prepareNextTurn() {
    checkForWinner();

    if (isCurrCardJoker()) {
      playSecondCardForJoker();
    }
    else {
      resetPerTurnVariables();

      setNextPlayer();

      if (requireNewDeal()) {
        setLastCardPlayed(null);
        setDealingParameters();
        dealCards();
      }
    }
  }

  function isCurrCardJoker() {
    return playedCard.current.getRank() === "R";
  }

  function playSecondCardForJoker() {
    // ASSERT (playedCard.current.getRank() === "R")
    const newCard = deck.current.dealCard();

    const cardPlayedImmediately = playedCard.current.getSuit() === "R" ? extraCardPlayedImmediatelyForRedJoker : extraCardPlayedImmediatelyForBlackJoker;

    hands[player.current].push(newCard);
    
    if (cardPlayedImmediately) {
      playCard(newCard);
    }
  }

  function resetPerTurnVariables() {
    resetWhereCanMoveLocations();

    selectedMarble.current = null;
    playedCard.current     = null;

    spacesLeftIn7.current  = 0;
  }

  function checkForWinner() {
    if (allMarblesInEndHome(player.current, marbles[player.current]) && allMarblesInEndHome(getTeammate(player.current), marbles[getTeammate(player.current)])) {
      setWinner(`${capitalizeFirstLetter(player.current)} and ${capitalizeFirstLetter(getTeammate(player.current))} win!`);
    }
  }

  function requireNewDeal() {
    return getNumCards(hands[dealer.current]) === 0;
  }

  function getNumCards(hand) {
    let count = 0;

    for (const card of hand) {
      if (card !== null) count += 1;
    }

    return count;
  }

  function selectingFirstMarbleForJack() {
    return selectedMarble.current === null;
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const HandArea = ({children}) => {
    return (
      <Flex 
        className="hand-area"
        width="100%"
        height="100%"
      >
        {!winner && (
          <>
            {children}
          </>
        )}
      </Flex>
    )
  }
  
  return (
      <VStack 
        className="game-area"
        height="100%"
        width="100%"
      >
        {/* <div className="display-turn">
          {winner || `${capitalizeFirstLetter(player.current)}'s turn!`}
        </div> */}
        <HStack
          width="100%"
          height="100%"
        >
          <HandArea>
            {!winner && (
              <>
              <Hand 
                currHand={hands[players[0]]} 
                currTurn={player.current===players[0]} 
                onCardClick={onCardClick} 
                marbles={marbles} 
                currPlayer={player.current}
              />
              <Hand 
                currHand={hands[players[3]]} 
                currTurn={player.current===players[3]} 
                onCardClick={onCardClick} 
                marbles={marbles} 
                currPlayer={player.current}
              />
              </>
            )}
          </HandArea> 
          <Flex
            className="board-area"
            direction="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100%"
          >
            <Board 
              marbles={marbles} 
              onMarbleClick={onMarbleClick} 
              onBoardPositionClick={onBoardPositionClick} 
              disableOtherMarbles={disableOtherMarbles.current}
              lastCardPlayed={lastCardPlayed}
            />
          </Flex>
          <HandArea>
            {!winner && (
              <>
              <Hand currHand={hands[players[1]]} currTurn={player.current===players[1]} onCardClick={onCardClick} marbles={marbles} currPlayer={player.current}/>
              <Hand currHand={hands[players[2]]} currTurn={player.current===players[2]} onCardClick={onCardClick} marbles={marbles} currPlayer={player.current}/>
              </>
            )}
          </HandArea>
        </HStack>
        <Box 
          className="start-game-area"
          marginBottom="20px"
        >
          <button className="start-game" onClick={() => startGame()}>Start Game</button>
          <button className="start-game" onClick={() => implementTest()}>Implement test case</button>
        </Box>
      </VStack>
  );
}

export default MarblesGame;
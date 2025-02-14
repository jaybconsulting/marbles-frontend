// GameSetup.js
// Purpose: defines all structures required for basic setup

import { getHomeStartLocations } from "../components/Board";

export const players = [
   "yellow",
   "green",
   "red",
   "blue"
 ]

export const extraCardPlayedImmediatelyForRedJoker   = false;
export const extraCardPlayedImmediatelyForBlackJoker = false;

export const dealingSequence = [5, 4, 4];

export const initialMarbles = players.reduce((marblesDict, player) => {
  marblesDict[player] = getHomeStartLocations(player).map(([marbleRow, marbleCol]) => ({
    row: marbleRow,
    col: marbleCol,
    colour: player,
    whereCanMove: [],
    allowUserToSelectWhereCanMove: false,
    isInPathOfOpposingTeams7: false,
  }));
  return marblesDict;
}, {});

export const initialHands = players.reduce((handsDict, player) => {
  handsDict[player] = [];
  return handsDict;
}, {});

 export function getTeammate(colour) {
   switch (colour) {
      case "yellow": return "red";
      case "green":  return "blue";
      case "red":    return "yellow";
      case "blue":   return "green";
      default:       return null; // TODO - throw an error
   }
 }

 export function getNextPlayer(colour) {
  switch (colour) {
    case "yellow": return "green";
    case "green":  return "red";
    case "red":    return "blue";
    case "blue":   return "yellow";
    default:       return null; // TODO - throw an error
  }
 }

 export function areOnOpposingTeams(player1, player2) {
  if (player1 === "yellow" || player1 === "red") 
  {
    return player2 === "green" || player2 === "blue";
  }
  
  return player2 === "yellow" || player2 === "red";
 }

 export const UpdateMarbles = {
  YES: true,
  NO: false
};
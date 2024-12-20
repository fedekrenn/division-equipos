import type { Player, PlayerGroup } from '../types';

export function balanceTeams(players: Player[], groups: PlayerGroup[]): [Player[], Player[]] {
  const groupedPlayers = new Map<string | undefined, Player[]>();
  
  groupedPlayers.set(undefined, []);
  
  groups.forEach(group => {
    groupedPlayers.set(group.id, []);
  });
  
  players.forEach(player => {
    const group = groups.find(g => g.players.includes(player.id));
    const groupId = group?.id;
    const groupPlayers = groupedPlayers.get(groupId) || [];
    groupPlayers.push(player);
    groupedPlayers.set(groupId, groupPlayers);
  });
  
  const team1: Player[] = [];
  const team2: Player[] = [];
  
  groups.forEach(group => {
    const groupPlayers = groupedPlayers.get(group.id) || [];
    const shuffled = [...groupPlayers].sort(() => Math.random() - 0.5);
    
    shuffled.forEach((player, index) => {
      if (index % 2 === 0) {
        team1.push(player);
      } else {
        team2.push(player);
      }
    });
  });
  
  const ungroupedPlayers = groupedPlayers.get(undefined) || [];
  const shuffledUngrouped = [...ungroupedPlayers].sort(() => Math.random() - 0.5);
  
  shuffledUngrouped.forEach(player => {
    if (team1.length < 6) {
      team1.push(player);
    } else {
      team2.push(player);
    }
  });
  
  return [team1, team2];
}
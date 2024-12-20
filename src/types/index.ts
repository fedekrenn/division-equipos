export interface Player {
  id: string;
  name: string;
  groupId?: string;
}

export interface PlayerGroup {
  id: string;
  name: string;
  players: string[];
}
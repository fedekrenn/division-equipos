import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import type { Player, PlayerGroup } from '../types';
import PlayerForm from './PlayerForm';
import PlayerList from './PlayerList';
import GroupPlayers from './GroupPlayers';
import { balanceTeams } from '../utils/teamBalancer';

export default function TeamOrganizer() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [teams, setTeams] = useState<{ team1: Player[]; team2: Player[] }>({
    team1: [],
    team2: [],
  });

  const addPlayer = ({ name }: Omit<Player, 'id'>) => {
    if (players.length < 12) {
      setPlayers([...players, { id: crypto.randomUUID(), name }]);
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
    setGroups(groups.map(group => ({
      ...group,
      players: group.players.filter(playerId => playerId !== id)
    })).filter(group => group.players.length >= 2));
    setTeams({ team1: [], team2: [] });
  };

  const removeFromGroup = (playerId: string) => {
    setGroups(groups.map(group => ({
      ...group,
      players: group.players.filter(id => id !== playerId)
    })).filter(group => group.players.length >= 2));
  };

  const createGroup = (name: string, playerIds: string[]) => {
    const updatedGroups = groups.map(group => ({
      ...group,
      players: group.players.filter(id => !playerIds.includes(id))
    })).filter(group => group.players.length >= 2);

    setGroups([
      ...updatedGroups,
      {
        id: crypto.randomUUID(),
        name,
        players: playerIds
      }
    ]);
  };

  const shuffleTeams = () => {
    if (players.length !== 12) return;
    const [team1, team2] = balanceTeams(players, groups);
    setTeams({ team1, team2 });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Organizador de Equipos</h1>
        <p className="text-gray-600">Fútbol 6 vs 6 Balanceado</p>
      </div>

      <PlayerForm 
        onAddPlayer={addPlayer}
        disabled={players.length >= 12}
      />

      {players.length > 0 && (
        <GroupPlayers
          players={players}
          groups={groups}
          onCreateGroup={createGroup}
        />
      )}

      <PlayerList
        players={players}
        groups={groups}
        onRemovePlayer={removePlayer}
        onRemoveFromGroup={removeFromGroup}
      />

      {players.length === 12 && (
        <div className="text-center mb-8">
          <button
            onClick={shuffleTeams}
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Shuffle size={20} />
            Organizar Equipos Balanceados
          </button>
        </div>
      )}

      {teams.team1.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Equipo 1</h3>
            <ul className="space-y-2">
              {teams.team1.map((player) => {
                const group = groups.find(g => g.players.includes(player.id));
                return (
                  <li
                    key={player.id}
                    className="bg-white p-3 rounded-md shadow-sm"
                  >
                    <span>{player.name}</span>
                    {group && (
                      <span className="ml-2 text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {group.name}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Equipo 2</h3>
            <ul className="space-y-2">
              {teams.team2.map((player) => {
                const group = groups.find(g => g.players.includes(player.id));
                return (
                  <li
                    key={player.id}
                    className="bg-white p-3 rounded-md shadow-sm"
                  >
                    <span>{player.name}</span>
                    {group && (
                      <span className="ml-2 text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {group.name}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
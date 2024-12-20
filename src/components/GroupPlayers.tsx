import { useState } from 'react';
import { Users } from 'lucide-react';
import type { Player, PlayerGroup } from '../types';

interface GroupPlayersProps {
  players: Player[];
  groups: PlayerGroup[];
  onCreateGroup: (name: string, playerIds: string[]) => void;
}

export default function GroupPlayers({ players, groups, onCreateGroup }: GroupPlayersProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isGrouping, setIsGrouping] = useState(false);

  const isPlayerInGroup = (playerId: string): boolean => {
    return groups.some(group => group.players.includes(playerId));
  };

  const handleTogglePlayer = (playerId: string) => {
    setSelectedPlayers(current =>
      current.includes(playerId)
        ? current.filter(id => id !== playerId)
        : [...current, playerId]
    );
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName && selectedPlayers.length >= 2) {
      onCreateGroup(groupName, selectedPlayers);
      setSelectedPlayers([]);
      setGroupName('');
      setIsGrouping(false);
    }
  };

  if (!isGrouping) {
    return (
      <button
        onClick={() => setIsGrouping(true)}
        className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
      >
        <Users size={20} />
        Crear grupo de jugadores similares
      </button>
    );
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Crear Grupo de Jugadores Similares</h3>
      <form onSubmit={handleCreateGroup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Grupo (ej: "Delanteros", "Defensores")
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nombre del grupo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona los jugadores similares (mínimo 2)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {players.map((player) => {
              const isAssigned = isPlayerInGroup(player.id);
              return (
                <label
                  key={player.id}
                  className={`flex items-center p-2 rounded-md ${
                    isAssigned 
                      ? 'bg-gray-100 cursor-not-allowed opacity-60'
                      : selectedPlayers.includes(player.id)
                      ? 'bg-blue-100 border-blue-500 cursor-pointer'
                      : 'bg-white border-gray-300 cursor-pointer'
                  } border`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlayers.includes(player.id)}
                    onChange={() => handleTogglePlayer(player.id)}
                    disabled={isAssigned}
                    className="mr-2"
                  />
                  {player.name}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={selectedPlayers.length < 2 || !groupName}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Crear Grupo
          </button>
          <button
            type="button"
            onClick={() => {
              setIsGrouping(false);
              setSelectedPlayers([]);
              setGroupName('');
            }}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
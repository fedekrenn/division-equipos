import { Trash2, Users, X } from 'lucide-react';
import type { Player, PlayerGroup } from '../types';

interface PlayerListProps {
  players: Player[];
  groups: PlayerGroup[];
  onRemovePlayer: (id: string) => void;
  onRemoveFromGroup: (playerId: string) => void;
}

export default function PlayerList({ 
  players, 
  groups, 
  onRemovePlayer, 
  onRemoveFromGroup 
}: PlayerListProps) {
  const getPlayerGroupName = (playerId: string) => {
    const group = groups.find(g => g.players.includes(playerId));
    return group ? group.name : null;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users size={24} />
          Jugadores ({players.length}/12)
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => {
          const groupName = getPlayerGroupName(player.id);
          
          return (
            <div
              key={player.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{player.name}</span>
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {groupName && (
                <div className="flex items-center gap-1">
                  <span className="flex-1 text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {groupName}
                  </span>
                  <button
                    onClick={() => onRemoveFromGroup(player.id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Eliminar del grupo"
                  >
                    <X size={14} className="text-gray-500" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Player } from '../types';

interface PlayerFormProps {
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  disabled: boolean;
}

export default function PlayerForm({ onAddPlayer, disabled }: PlayerFormProps) {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer({ name: playerName.trim() });
      setPlayerName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Nombre del jugador"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={30}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Agregar Jugador
        </button>
      </div>
    </form>
  );
}
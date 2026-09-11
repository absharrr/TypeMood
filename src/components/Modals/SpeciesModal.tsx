import React from 'react';
import { PlantSpecies } from '../../types/typing';
import { Sprout, Lock, CheckCircle2, Award } from 'lucide-react';

interface SpeciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpecies: PlantSpecies;
  unlockedSpecies: PlantSpecies[];
  onSelectSpecies: (species: PlantSpecies) => void;
}

interface SpeciesInfo {
  id: PlantSpecies;
  name: string;
  emoji: string;
  description: string;
  unlockRequirement: string;
}

const SPECIES_LIST: SpeciesInfo[] = [
  {
    id: 'FERN',
    name: 'Lush Emerald Fern',
    emoji: '🌿',
    description: 'Your starter companion. Highly expressive leaves that wilt, perk up, and bloom with pink flowers during steady typing.',
    unlockRequirement: 'Unlocked by default',
  },
  {
    id: 'BONSAI',
    name: 'Zen Sakura Bonsai',
    emoji: '🪴',
    description: 'Graceful Zen Bonsai tree with delicate sakura blossoms and serene swaying motion for deep focus typists.',
    unlockRequirement: 'Maintain 75%+ average plant health score across days',
  },
  {
    id: 'CACTUS',
    name: 'Prickly Barrel Cactus',
    emoji: '🌵',
    description: 'Resilient desert cactus with a cute flower hat and spiky needles that bristle up when you rage type.',
    unlockRequirement: 'Type 2,000+ total keystrokes in your journal',
  },
  {
    id: 'GOLDEN_BLOSSOM',
    name: 'Cosmic Golden Blossom',
    emoji: '✨',
    description: 'Mastery tier golden flora that radiates glowing cosmic sparkles during peak steady flow state.',
    unlockRequirement: 'Type 5,000+ total keystrokes with 80%+ average health',
  },
];

export const SpeciesModal: React.FC<SpeciesModalProps> = ({
  isOpen,
  onClose,
  currentSpecies,
  unlockedSpecies,
  onSelectSpecies,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-5 border border-slate-700 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">Plant Species Nursery</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-sm p-1 rounded-lg">
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Your plant species evolves as your long-term typing cadence builds. Select an unlocked companion below:
        </p>

        <div className="space-y-3">
          {SPECIES_LIST.map((sp) => {
            const isUnlocked = unlockedSpecies.includes(sp.id);
            const isSelected = currentSpecies === sp.id;

            return (
              <div
                key={sp.id}
                onClick={() => isUnlocked && onSelectSpecies(sp.id)}
                className={`p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-950/40'
                    : isUnlocked
                    ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600 cursor-pointer'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl select-none">{sp.emoji}</span>
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm flex items-center space-x-2">
                        <span>{sp.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{sp.description}</p>
                    </div>
                  </div>

                  {!isUnlocked && (
                    <div className="p-1.5 bg-slate-800 rounded-lg text-slate-500 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {!isUnlocked && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-amber-400/90 font-mono flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>Unlock: {sp.unlockRequirement}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

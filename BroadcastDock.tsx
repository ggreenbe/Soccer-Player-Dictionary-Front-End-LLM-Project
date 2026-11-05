import React from 'react';
import {
  Calculator,
  ListTree,
  UserPlus,
  PlusSquare,
  BarChart3,
  Trash2,
  Crown,
  Layers3,
} from 'lucide-react';
import { ActiveModal } from '../types/soccer';

interface BroadcastDockProps {
  activeModal: ActiveModal;
  onOpenModal: (modal: ActiveModal) => void;
}

export const BroadcastDock: React.FC<BroadcastDockProps> = ({
  activeModal,
  onOpenModal,
}) => {
  const menuItems: Array<{
    id: ActiveModal;
    number: number;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: 'career_rating',
      number: 1,
      label: 'Career Rating',
      sublabel: 'Ranked Carousel',
      icon: <Calculator className="w-4 h-4" />,
      color: 'hover:border-amber-400 hover:text-amber-300',
    },
    {
      id: 'list_contents',
      number: 2,
      label: 'Full Contents',
      sublabel: 'Dictionary Cards',
      icon: <ListTree className="w-4 h-4" />,
      color: 'hover:border-cyan-400 hover:text-cyan-300',
    },
    {
      id: 'add_player',
      number: 3,
      label: 'Add Player',
      sublabel: 'Temporary Scout',
      icon: <UserPlus className="w-4 h-4" />,
      color: 'hover:border-emerald-400 hover:text-emerald-300',
    },
    {
      id: 'add_stat',
      number: 4,
      label: 'Add Stat',
      sublabel: 'Append Metrics',
      icon: <PlusSquare className="w-4 h-4" />,
      color: 'hover:border-purple-400 hover:text-purple-300',
    },
    {
      id: 'category_averages',
      number: 5,
      label: 'Stat Averages',
      sublabel: 'Positional Delta',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'hover:border-blue-400 hover:text-blue-300',
    },
    {
      id: 'delete_item',
      number: 6,
      label: 'Delete Item',
      sublabel: 'Player or Stat',
      icon: <Trash2 className="w-4 h-4" />,
      color: 'hover:border-rose-400 hover:text-rose-300',
    },
    {
      id: 'category_leaders',
      number: 7,
      label: 'Leaders',
      sublabel: 'Golden Boot / Play',
      icon: <Crown className="w-4 h-4" />,
      color: 'hover:border-yellow-400 hover:text-yellow-300',
    },
  ];

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-[98vw] overflow-x-auto p-1.5 rounded-2xl bg-slate-950/92 backdrop-blur-2xl border border-white/15 shadow-[0_15px_50px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-1.5 min-w-max">
        {/* Tactical Pitch Home Button */}
        <button
          onClick={() => onOpenModal(null)}
          className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200 border ${
            activeModal === null
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-inner'
              : 'bg-slate-900/60 text-slate-300 border-white/5 hover:border-emerald-400/40 hover:bg-slate-800/80'
          }`}
          title="Return to 3D Soccer Pitch"
        >
          <div
            className={`p-1.5 rounded-lg transition-colors ${
              activeModal === null
                ? 'bg-emerald-400 text-slate-950'
                : 'bg-white/5 text-slate-400 group-hover:text-emerald-300'
            }`}
          >
            <Layers3 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold font-display tracking-tight text-white whitespace-nowrap">
              Tactical Pitch
            </span>
            <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
              Stadium Arena
            </span>
          </div>
        </button>

        <div className="w-[1px] h-7 bg-white/10 mx-0.5" />

        {/* The 7 Functions */}
        {menuItems.map((item) => {
          const isActive = activeModal === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onOpenModal(isActive ? null : item.id)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200 border ${
                isActive
                  ? 'bg-white/20 text-white border-white/40 shadow-inner ring-1 ring-white/20'
                  : `bg-slate-900/60 text-slate-300 border-white/5 ${item.color} hover:bg-slate-800/80`
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-400 group-hover:text-white'
                }`}
              >
                {item.icon}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-tactical font-black opacity-60">
                    {item.number} |
                  </span>
                  <span className="text-xs font-bold font-display tracking-tight text-white whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                  {item.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers3 } from 'lucide-react';
import { Player } from '../types/soccer';
import { PlayerAvatar } from './PlayerAvatar';

interface PitchFieldProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  onClearSelection: () => void;
}

export const PitchField: React.FC<PitchFieldProps> = ({
  players,
  selectedPlayer,
  onSelectPlayer,
  onClearSelection,
}) => {
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Elastic Broadcast Camera Kinematics:
  // Calculate percentage translations so the focused player glides into center view
  const targetScale = selectedPlayer ? 1.85 : 1;
  const targetX = selectedPlayer ? -(selectedPlayer.fieldCoordinates.x - 50) * 0.9 : 0;
  const targetY = selectedPlayer ? -(selectedPlayer.fieldCoordinates.y - 50) * 0.8 : 0;

  return (
    <div className="relative w-full h-[640px] md:h-[760px] lg:h-[820px] overflow-hidden rounded-2xl border border-slate-800 bg-[#060a12] shadow-2xl select-none">
      {/* 3D Mode Camera Toggle */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <button
          onClick={() => setIs3DMode((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-tactical font-bold transition-all shadow-lg backdrop-blur-md active:scale-95 ${
            is3DMode
              ? 'bg-amber-400 text-slate-950 border-amber-300'
              : 'bg-slate-900/90 text-slate-300 border-white/10 hover:text-white'
          }`}
          title="Toggle 3D Stadium Camera Pitch Tilt"
        >
          <Layers3 className="w-3.5 h-3.5" />
          <span>{is3DMode ? '3D Stadium View' : '2D Tactical View'}</span>
        </button>
      </div>

      {/* Camera Transformed Pitch Container with Elastic Broadcast Spring */}
      <motion.div
        animate={{
          scale: targetScale,
          x: `${targetX}%`,
          y: `${targetY}%`,
        }}
        transition={{
          type: 'spring',
          stiffness: 160,
          damping: 24,
          mass: 0.85,
        }}
        className="w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-6"
        style={{
          transformOrigin: '50% 50%',
        }}
      >
        {/* Soccer Stadium Turf Surface - Perfectly Uniform Brightness On All Parts */}
        <motion.div
          animate={{
            rotateX: is3DMode && !selectedPlayer ? 12 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClearSelection();
            }
          }}
          className="relative w-full h-full max-w-[1360px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-4 border-white/25 pitch-grass-stripes cursor-default"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 80%',
          }}
        >
          {/* SVG Pitch Tactical Markings */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1050 680"
            preserveAspectRatio="none"
          >
            {/* Outer Pitch Boundary Line */}
            <rect
              x="25"
              y="25"
              width="1000"
              height="630"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3.5"
            />

            {/* Halfway Line */}
            <line
              x1="525"
              y1="25"
              x2="525"
              y2="655"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3.5"
            />

            {/* Center Circle & Center Spot */}
            <circle
              cx="525"
              cy="340"
              r="91.5"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3.5"
            />
            <circle cx="525" cy="340" r="5" fill="rgba(255, 255, 255, 0.95)" />

            {/* ================= LEFT HALF (LEGENDS) ================= */}
            <rect
              x="25"
              y="160"
              width="165"
              height="360"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3.5"
            />
            <rect
              x="25"
              y="245"
              width="55"
              height="190"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3.5"
            />
            <circle cx="135" cy="340" r="4" fill="rgba(255, 255, 255, 0.95)" />
            <path
              d="M 190 275 A 91.5 91.5 0 0 1 190 405"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3.5"
            />
            <rect
              x="5"
              y="285"
              width="20"
              height="110"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="2.5"
            />

            {/* ================= RIGHT HALF (STARS) ================= */}
            <rect
              x="860"
              y="160"
              width="165"
              height="360"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3.5"
            />
            <rect
              x="970"
              y="245"
              width="55"
              height="190"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3.5"
            />
            <circle cx="915" cy="340" r="4" fill="rgba(255, 255, 255, 0.95)" />
            <path
              d="M 860 275 A 91.5 91.5 0 0 0 860 405"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3.5"
            />
            <rect
              x="1025"
              y="285"
              width="20"
              height="110"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="2.5"
            />

            {/* Corner Arcs */}
            <path d="M 25 45 A 20 20 0 0 0 45 25" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
            <path d="M 25 635 A 20 20 0 0 1 45 655" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
            <path d="M 1005 25 A 20 20 0 0 0 1025 45" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
            <path d="M 1005 655 A 20 20 0 0 1 1025 635" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />

            {/* In-Grass Stencil Typography */}
            <text
              x="260"
              y="75"
              fill="rgba(255, 255, 255, 0.2)"
              fontSize="28"
              fontFamily="Syne, sans-serif"
              fontWeight="900"
              letterSpacing="6"
              textAnchor="middle"
            >
              LEGENDS HALF
            </text>
            <text
              x="790"
              y="75"
              fill="rgba(255, 255, 255, 0.2)"
              fontSize="28"
              fontFamily="Syne, sans-serif"
              fontWeight="900"
              letterSpacing="6"
              textAnchor="middle"
            >
              MODERN STARS HALF
            </text>
          </svg>

          {/* Interactive 3D Player Figurines on Pitch */}
          {players.map((player) => {
            const isSelected = selectedPlayer?.id === player.id;
            const depthZIndex = Math.round(player.fieldCoordinates.y * 10) + (isSelected ? 500 : 0);

            return (
              <div
                key={player.id}
                style={{
                  position: 'absolute',
                  left: `${player.fieldCoordinates.x}%`,
                  top: `${player.fieldCoordinates.y}%`,
                  transform: 'translate(-50%, -75%)',
                  zIndex: depthZIndex,
                }}
              >
                <PlayerAvatar
                  player={player}
                  isSelected={isSelected}
                  onClick={() => onSelectPlayer(player)}
                />
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

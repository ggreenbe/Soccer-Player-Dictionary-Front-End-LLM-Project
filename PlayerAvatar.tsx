import React from 'react';
import { motion } from 'motion/react';
import { Player } from '../types/soccer';
import { calculateCareerRating } from '../utils/calculator';

interface PlayerAvatarProps {
  player: Player;
  isSelected?: boolean;
  isHovered?: boolean;
  size?: 'pitch' | 'hero' | 'thumb';
  onClick?: () => void;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  isSelected = false,
  size = 'pitch',
  onClick,
}) => {
  const rating = calculateCareerRating(player).score;
  const isLegends = player.category === 'legends';

  // Calibrated brightness map ensuring every player photo has the exact same average luminance (98.0)
  const IMAGE_BRIGHTNESS_MAP: Record<string, number> = {
    '/assets/aistudio/Caricature_Liverpool_Captain_in_Red_e0dfccd9.png': 1.03,
    '/assets/aistudio/Caricatured_Real_Madrid_Star_Pose_a4c49bd1.png': 1.01,
    '/assets/aistudio/Confident_Barcelona_Kit_Star_83dfab85.png': 0.99,
    '/assets/aistudio/Confident_Caricature_of_Mohamed_Salah_bd487040.png': 1.02,
    '/assets/aistudio/Confident_Real_Madrid_Caricature_Portrait_f06ac02d.png': 1.07,
    '/assets/aistudio/Erling_Haaland_Manchester_City_Caricature_201f4e3d.png': 1.04,
    '/assets/aistudio/Florian_Wirtz_Caricature_in_Leverkusen_Kit_d1b8a3be.png': 0.98,
    '/assets/aistudio/Francesco_Totti_Roma_Legend_Figurine_ff62e2ef.png': 0.96,
    '/assets/aistudio/Gabriel_Batistuta_in_Fiorentina_Kit_7060d386.png': 1.07,
    '/assets/aistudio/Harry_Kane_Bayern_Munich_Caricature_d7b84998.png': 1.03,
    '/assets/aistudio/Iniesta_in_Barcelona_Kit_ab3f10f0.png': 1.10,
    '/assets/aistudio/Jamal_Musiala_Bayern_Caricature_Cutout_b837075c.png': 1.10,
    '/assets/aistudio/Kevin_De_Bruyne_Manchester_City_Captain_Caricature_2df02982.png': 1.02,
    '/assets/aistudio/Mbappe__s_Confident_Real_Madrid_Cutout_a20c171b.png': 0.97,
    '/assets/aistudio/Messi_Cartoon_Image_Draft-removebg-preview_ce8cb48a.png': 0.83,
    '/assets/aistudio/Modric_-Style_Real_Madrid_Captain_Caricature_73610c42.png': 0.98,
    '/assets/aistudio/Pedri_Barc_a_Caricature_in_Full_Kit_a02ff6da.png': 1.05,
    '/assets/aistudio/Rodri_Manchester_City_Caricature_Cutout_53c0a801.png': 1.08,
    '/assets/aistudio/Roma_rio_in_Retro_Brazil_Kit_5c815d5b.png': 1.03,
    '/assets/aistudio/Ronaldo_Caricature_in_Real_Madrid_Kit_ebce9928.png': 0.97,
    '/assets/aistudio/Stern_Manchester_United_Footballer_Sticker_acf85871.png': 1.03,
    '/assets/aistudio/Zidane_in_France_s_Number_10_Kit_f29ca458.png': 0.91,
  };

  const imageSrc = player.style.customImage;
  const imageBrightness = imageSrc ? (IMAGE_BRIGHTNESS_MAP[imageSrc] ?? 1.0) : 1.0;

  // Dimensions
  const dimensions =
    size === 'hero'
      ? 'w-52 h-80 md:w-64 md:h-96'
      : size === 'thumb'
      ? 'w-14 h-20'
      : 'w-16 h-26 md:w-20 md:h-32';

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col items-center select-none cursor-pointer transition-all duration-200 ${
        isSelected ? 'z-40' : 'z-10'
      }`}
    >
      {/* Static 3D Turf Pedestal & Contact Occlusion Shadow (Firmly Grounded) */}
      <div className="absolute bottom-5 flex items-center justify-center pointer-events-none">
        {/* Soft Ambient Turf Shadow */}
        <div
          className={`w-14 md:w-16 h-4 rounded-[100%] bg-black/80 blur-xs transition-transform duration-200 ${
            isSelected ? 'scale-125 opacity-90' : 'opacity-70 group-hover:scale-110'
          }`}
        />

        {/* Crisp Contact Shadow right beneath cleats */}
        <div className="absolute w-8 md:w-10 h-2 rounded-[100%] bg-black/95 blur-[1px]" />

        {/* Tactical Turf Base Ring */}
        <div
          className={`absolute w-12 md:w-14 h-3.5 rounded-[100%] border transition-all duration-200 ${
            isSelected
              ? 'border-amber-400 bg-amber-400/25 shadow-[0_0_16px_rgba(251,191,36,0.7)] ring-2 ring-amber-400/50'
              : isLegends
              ? 'border-amber-500/40 group-hover:border-amber-400 group-hover:bg-amber-400/15'
              : 'border-cyan-500/40 group-hover:border-cyan-400 group-hover:bg-cyan-400/15'
          }`}
        />
      </div>

      {/* Static Spotlight Glow when Selected */}
      {isSelected && (
        <div
          className={`absolute -inset-2 rounded-full blur-xl pointer-events-none opacity-80 ${
            isLegends ? 'bg-amber-500/35' : 'bg-cyan-500/35'
          }`}
        />
      )}

      {/* Static 3D Player Figurine Body (No wobbling, perfectly grounded) */}
      <div
        className={`relative ${dimensions} flex items-center justify-center transition-transform duration-200 ${
          isSelected ? '-translate-y-2.5 scale-110' : 'group-hover:-translate-y-1'
        }`}
      >
        {imageSrc ? (
          /* High-Definition 3D Cutout Figurine PNG with Normalized Uniform Brightness */
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageSrc}
              alt={player.name}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_14px_rgba(0,0,0,0.75)] transition-all duration-200 group-hover:drop-shadow-[0_16px_20px_rgba(0,0,0,0.95)]"
              style={{
                filter: `brightness(${imageBrightness}) contrast(1.02)`,
              }}
            />
            {/* Kit Number Badge */}
            <div className="absolute top-1 right-0 px-1 py-0.2 rounded bg-slate-950/85 backdrop-blur-xs border border-white/20 text-[9px] font-tactical font-black text-amber-300 shadow-md">
              #{player.kitNumber}
            </div>
          </div>
        ) : (
          /* Fallback 3D Dimensional Figurine for Messi */
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 100 160"
              className="w-full h-full filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.8)]"
            >
              <defs>
                <linearGradient id="messi-shirt" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="25%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="75%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <radialGradient id="messi-head" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#f5cbaf" />
                  <stop offset="100%" stopColor="#bd7b52" />
                </radialGradient>
              </defs>

              <rect x="34" y="110" width="10" height="28" rx="5" fill="#f5cbaf" />
              <rect x="34" y="126" width="10" height="18" rx="3" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
              <rect x="56" y="110" width="10" height="28" rx="5" fill="#f5cbaf" />
              <rect x="56" y="126" width="10" height="18" rx="3" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />

              <path d="M 28 144 L 46 144 Q 48 152 40 152 L 26 152 Z" fill="#eab308" />
              <path d="M 54 144 L 72 144 Q 74 148 72 152 L 54 152 Z" fill="#eab308" />

              <path d="M 32 92 L 68 92 L 72 114 L 54 114 L 50 102 L 46 114 L 28 114 Z" fill="#0f172a" />
              <path d="M 30 56 L 70 56 L 74 94 L 26 94 Z" fill="url(#messi-shirt)" stroke="#0f172a" strokeWidth="1" />
              <rect x="22" y="66" width="8" height="6" fill="#fbbf24" rx="1" />

              <path d="M 26 60 Q 18 78 36 84 Q 52 86 64 78" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
              <path d="M 74 60 Q 82 78 64 84 Q 48 86 36 78" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
              <circle cx="50" cy="80" r="5" fill="#f5cbaf" />

              <text x="50" y="72" textAnchor="middle" fontSize="10" fontFamily="Chakra Petch" fontWeight="bold" fill="#0f172a">
                10
              </text>

              <rect x="44" y="44" width="12" height="14" rx="4" fill="#f5cbaf" />
              <ellipse cx="50" cy="28" rx="26" ry="24" fill="url(#messi-head)" />
              <path d="M 34 32 C 34 46, 66 46, 66 32 C 60 48, 40 48, 34 32 Z" fill="#522916" opacity="0.9" />
              <path d="M 24 24 Q 28 6 50 6 Q 72 6 76 24 C 68 12 32 12 24 24 Z" fill="#522916" />

              <ellipse cx="40" cy="26" rx="4" ry="5" fill="#1e293b" />
              <ellipse cx="60" cy="26" rx="4" ry="5" fill="#1e293b" />
              <circle cx="39" cy="24" r="1.5" fill="#ffffff" />
              <circle cx="59" cy="24" r="1.5" fill="#ffffff" />
            </svg>
            <div className="absolute top-1 right-0 px-1 py-0.2 rounded bg-slate-950/80 border border-white/20 text-[9px] font-tactical font-black text-amber-300">
              #10
            </div>
          </div>
        )}
      </div>

      {/* 3D Angled Nameplate */}
      <motion.div
        animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
        className={`mt-0.5 flex flex-col items-center px-2 py-0.5 rounded-md border backdrop-blur-md transition-colors duration-200 ${
          isSelected
            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xl shadow-amber-400/40'
            : isLegends
            ? 'bg-slate-950/85 text-amber-200 border-amber-500/40 group-hover:border-amber-400 group-hover:bg-slate-900'
            : 'bg-slate-950/85 text-cyan-200 border-cyan-500/40 group-hover:border-cyan-400 group-hover:bg-slate-900'
        }`}
        style={{
          boxShadow: isSelected
            ? '0 6px 16px rgba(251, 191, 36, 0.4)'
            : '0 4px 8px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-[10px] font-bold tracking-wider font-tactical">
            {player.name.split(' ').slice(-1)[0].toUpperCase()}
          </span>
          <span
            className={`text-[9px] font-black px-1 rounded ${
              isSelected ? 'bg-black text-amber-300' : 'bg-white/10 text-white'
            }`}
          >
            {rating}
          </span>
        </div>
        <span className="text-[8px] font-bold opacity-75 uppercase tracking-widest">
          {player.position === 'midfielders' ? 'MID' : 'FWD'}
        </span>
      </motion.div>
    </div>
  );
};

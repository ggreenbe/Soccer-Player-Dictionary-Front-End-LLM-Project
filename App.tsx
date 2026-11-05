import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ActiveModal, Player } from './types/soccer';
import { INITIAL_PLAYERS } from './data/initialPlayers';
import { PitchField } from './components/PitchField';
import { PlayerDetailWings } from './components/PlayerDetailWings';
import { BroadcastHeader } from './components/BroadcastHeader';
import { BroadcastDock } from './components/BroadcastDock';
import { RankedCarouselView } from './components/RankedCarouselView';

// Modals
import { CareerRatingModal } from './components/modals/CareerRatingModal';
import { FullContentsModal } from './components/modals/FullContentsModal';
import { AddPlayerModal } from './components/modals/AddPlayerModal';
import { AddStatModal } from './components/modals/AddStatModal';
import { CategoryAveragesModal } from './components/modals/CategoryAveragesModal';
import { DeleteModal } from './components/modals/DeleteModal';
import { CategoryLeadersModal } from './components/modals/CategoryLeadersModal';

export default function App() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [hasModifications, setHasModifications] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sub-modal popups when explicitly triggered from carousel or header
  const [showAddPlayerModal, setShowAddPlayerModal] = useState<boolean>(false);
  const [showAddStatModal, setShowAddStatModal] = useState<boolean>(false);
  const [statTargetPlayer, setStatTargetPlayer] = useState<Player | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteTargetPlayer, setDeleteTargetPlayer] = useState<Player | null>(null);
  const [showFullTreeModal, setShowFullTreeModal] = useState<boolean>(false);

  // Helper to show transient notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Keep selectedPlayer reference synced if players array updates
  useEffect(() => {
    if (selectedPlayer) {
      const refreshed = players.find((p) => p.id === selectedPlayer.id);
      setSelectedPlayer(refreshed || null);
    }
  }, [players]);

  // Handle global escape key to reset selection or close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAddPlayerModal) {
          setShowAddPlayerModal(false);
        } else if (showAddStatModal) {
          setShowAddStatModal(false);
        } else if (showDeleteModal) {
          setShowDeleteModal(false);
        } else if (showFullTreeModal) {
          setShowFullTreeModal(false);
        } else if (activeModal) {
          setActiveModal(null);
        } else if (selectedPlayer) {
          setSelectedPlayer(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showAddPlayerModal,
    showAddStatModal,
    showDeleteModal,
    showFullTreeModal,
    activeModal,
    selectedPlayer,
  ]);

  // Roster mutations (Temporary Session Only)
  const handleAddPlayer = useCallback((newPlayer: Player) => {
    setPlayers((prev) => [...prev, newPlayer]);
    setHasModifications(true);
    setSelectedPlayer(newPlayer);
    setShowAddPlayerModal(false);
    showToast(`Added ${newPlayer.name} to ${newPlayer.category} on pitch & rankings!`);
  }, []);

  const handleUpdateStat = useCallback((playerId: string, statName: string, value: number) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          return {
            ...p,
            stats: {
              ...p.stats,
              [statName]: value,
            },
          };
        }
        return p;
      })
    );
    setHasModifications(true);
    setShowAddStatModal(false);
    showToast(`Updated ${statName} for player!`);
  }, []);

  const handleDeletePlayer = useCallback(
    (playerId: string) => {
      const target = players.find((p) => p.id === playerId);
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
      setHasModifications(true);
      setShowDeleteModal(false);
      if (selectedPlayer?.id === playerId) {
        setSelectedPlayer(null);
      }
      showToast(`Removed ${target?.name || 'player'} from roster (temporary session)`);
    },
    [players, selectedPlayer]
  );

  const handleDeleteStat = useCallback((playerId: string, statName: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          const newStats = { ...p.stats };
          delete newStats[statName];
          return { ...p, stats: newStats };
        }
        return p;
      })
    );
    setHasModifications(true);
    setShowDeleteModal(false);
    showToast(`Deleted ${statName} stat`);
  }, []);

  const handleResetRoster = useCallback(() => {
    setPlayers(INITIAL_PLAYERS);
    setHasModifications(false);
    setSelectedPlayer(null);
    showToast('Reset roster to original baseline Python dictionary');
  }, []);

  return (
    <div className="relative min-h-screen bg-[#06090f] text-slate-100 flex flex-col justify-between overflow-x-hidden select-none pb-20">
      {/* Top EA FC Champions League Broadcast Header */}
      <BroadcastHeader
        players={players}
        selectedPlayer={selectedPlayer}
        hasModifications={hasModifications}
        onResetRoster={handleResetRoster}
        onClearSelection={() => setSelectedPlayer(null)}
        onSelectPlayer={(p) => setSelectedPlayer(p)}
      />

      {/* Main Content Area: Switches between Tactical Pitch and Ranked Carousel based on activeFunction */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-2 sm:p-4 lg:p-6">
        <div className="relative w-full max-w-[1400px]">
          <AnimatePresence mode="wait">
            {activeModal ? (
              /* ================= FUNCTION ACTIVE: HORIZONTALLY SCROLLING RANKED CAROUSEL ================= */
              <motion.div
                key="ranked-carousel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <RankedCarouselView
                  players={players}
                  activeFunction={activeModal}
                  selectedPlayer={selectedPlayer}
                  onSelectPlayer={(p) => setSelectedPlayer(p)}
                  onCloseToPitch={() => setActiveModal(null)}
                  onOpenAddPlayer={() => setShowAddPlayerModal(true)}
                  onOpenAddStat={(p) => {
                    setStatTargetPlayer(p || selectedPlayer || null);
                    setShowAddStatModal(true);
                  }}
                  onOpenDelete={(p) => {
                    setDeleteTargetPlayer(p || selectedPlayer || null);
                    setShowDeleteModal(true);
                  }}
                  onOpenFullContentsTree={() => setShowFullTreeModal(true)}
                  onDeletePlayerDirect={handleDeletePlayer}
                  onDeleteStatDirect={handleDeleteStat}
                  onChangeFunction={(fn) => setActiveModal(fn)}
                />
              </motion.div>
            ) : (
              /* ================= NO FUNCTION ACTIVE: TACTICAL PITCH FIELD ARENA ================= */
              <motion.div
                key="tactical-pitch"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="relative w-full"
              >
                <PitchField
                  players={players}
                  selectedPlayer={selectedPlayer}
                  onSelectPlayer={(player) => setSelectedPlayer(player)}
                  onClearSelection={() => setSelectedPlayer(null)}
                />

                {/* Side Wings on Zoom Selection with Holographic Card Flip */}
                <AnimatePresence>
                  {selectedPlayer && (
                    <PlayerDetailWings
                      key={selectedPlayer.id}
                      player={selectedPlayer}
                      allPlayers={players}
                      onClose={() => setSelectedPlayer(null)}
                      onOpenAddStat={() => {
                        setStatTargetPlayer(selectedPlayer);
                        setShowAddStatModal(true);
                      }}
                      onDeletePlayer={(p) => {
                        handleDeletePlayer(p.id);
                      }}
                      onOpenRatingBreakdown={() => setActiveModal('career_rating')}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Tactical Bottom HUD Dock (Functions 1-7 + Tactical Pitch) */}
      <BroadcastDock
        activeModal={activeModal}
        onOpenModal={(modal) => {
          setActiveModal(modal);
          // If user specifically clicked Add Player, also open the modal drawer
          if (modal === 'add_player') {
            setShowAddPlayerModal(true);
          } else if (modal === 'delete_item') {
            setShowDeleteModal(true);
          }
        }}
      />

      {/* Toast Notification Ticker */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900/95 border border-amber-400/40 text-amber-200 text-xs font-tactical font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* ================= MODAL DIALOG SUBSYSTEM ================= */}
      <AnimatePresence>
        {/* Full Contents Visual Tree / Raw Python code modal */}
        {showFullTreeModal && (
          <FullContentsModal
            key="list_contents_modal"
            players={players}
            onSelectPlayerToZoom={(p) => {
              setSelectedPlayer(p);
              setShowFullTreeModal(false);
            }}
            onClose={() => setShowFullTreeModal(false)}
          />
        )}

        {/* Add Player Modal */}
        {showAddPlayerModal && (
          <AddPlayerModal
            key="add_player_modal"
            onAddPlayer={handleAddPlayer}
            onClose={() => setShowAddPlayerModal(false)}
          />
        )}

        {/* Add / Update Stat Modal */}
        {showAddStatModal && (
          <AddStatModal
            key="add_stat_modal"
            players={players}
            targetPlayer={statTargetPlayer || selectedPlayer}
            onUpdateStat={handleUpdateStat}
            onClose={() => setShowAddStatModal(false)}
          />
        )}

        {/* Delete Player or Stat Modal */}
        {showDeleteModal && (
          <DeleteModal
            key="delete_item_modal"
            players={players}
            targetPlayer={deleteTargetPlayer || selectedPlayer}
            onDeletePlayer={handleDeletePlayer}
            onDeleteStat={handleDeleteStat}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus } from 'lucide-react';

import { StarBackground } from '../components/dashboard/Background';
import { DashboardNavbar } from '../components/dashboard/Navbar';
import { ForgePage } from '../components/dashboard/Forge';
import { GuildPage } from '../components/dashboard/Guild';
import { QuestBoardModal } from '../components/dashboard/QuestModal';
import { HeroHeader, QuestItem, StatCard, FocusSession, WorkProgress, ActiveGuild } from '../components/dashboard/Widgets';
import { Quest } from '../types';

export default function Hub() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'hub' | 'forge' | 'guild'>('hub');
  const [isQuestBoardOpen, setIsQuestBoardOpen] = useState(false);

  const quests: Quest[] = [
    { id: '1', title: 'Review pull requests', category: 'Work', xp: 50, gold: 10, completed: false },
    { id: '2', title: 'Drink 2L Water', category: 'Health', xp: 25, gold: 5, completed: true },
    { id: '3', title: 'Read 10 pages', category: 'Intellect', xp: 30, gold: 5, completed: false },
  ];

  const totalXP = 450;
  const totalGold = 120;

  return (
    <div className="min-h-screen pb-20 relative">
      <StarBackground />
      <DashboardNavbar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        xp={totalXP} 
        gold={totalGold}
        onLogout={() => navigate('/')}
      />

      <QuestBoardModal 
        isOpen={isQuestBoardOpen} 
        onClose={() => setIsQuestBoardOpen(false)} 
        quests={quests} 
      />
      
      <main className="max-w-7xl mx-auto px-8 pt-12">
        {currentView === 'hub' ? (
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Main Content */}
            <div className="col-span-8 flex flex-col gap-8">
              <HeroHeader />
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={20} className="text-white/40" />
                    <h3 className="text-xl font-bold">Today's Quests</h3>
                  </div>
                  <button 
                    onClick={() => setIsQuestBoardOpen(true)}
                    className="bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors border border-white/5"
                  >
                    Open Board
                  </button>
                </div>
                
                <div className="flex flex-col gap-3">
                  {quests.map(quest => (
                    <QuestItem key={quest.id} quest={quest} />
                  ))}
                  
                  <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-white/20 font-bold hover:border-white/10 hover:text-white/40 transition-all flex items-center justify-center gap-2">
                    <Plus size={18} /> Add New Quest
                  </button>
                </div>
              </div>

              <WorkProgress />
            </div>

            {/* Right Column: Sidebar Widgets */}
            <div className="col-span-4 flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Quests Beaten" value={128} colorClass="text-white" />
                <StatCard label="Gold Pieces" value={450} colorClass="text-accent-yellow" />
              </div>
              
              <FocusSession />
              <ActiveGuild />
            </div>
          </div>
        ) : currentView === 'forge' ? (
          <ForgePage />
        ) : (
          <GuildPage />
        )}
      </main>
    </div>
  );
}

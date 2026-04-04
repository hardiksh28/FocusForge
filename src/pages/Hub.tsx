import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, Check } from 'lucide-react';
import { api } from '../lib/api';
import { Quest } from '../types';

import { StarBackground } from '../components/dashboard/Background';
import { DashboardNavbar } from '../components/dashboard/Navbar';
import { ForgePage } from '../components/dashboard/Forge';
import { GuildPage } from '../components/dashboard/Guild';
import { HeroHeader, QuestItem, StatCard, FocusSession, WorkProgress, AddQuestModal, DailySignIn } from '../components/dashboard/Widgets';

export default function Hub() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'hub' | 'forge' | 'guild'>('hub');
  const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [userData, questsData] = await Promise.all([
        api.auth.me(),
        api.quests.getAll(),
      ]);
      setUser(userData);
      setQuests(questsData);
    } catch(e) {
      console.error("Load balance error:", e);
      // Only navigate if we're sure it's an auth error
      if ((e as Error).message === 'Not authenticated') {
        navigate('/login');
      }
    } finally {
       setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  if (isLoading || !user) return (
    <div className="min-h-screen bg-forge-bg text-white flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-forge-accent border-t-transparent rounded-full animate-spin" />
      <p className="font-bold tracking-widest uppercase text-xs text-white/20">Entering the Forge...</p>
    </div>
  );

  const totalXP = user.xp || 0;
  const totalGold = user.gold || 0;
  const questsCompleted = quests.filter(q => q.completed).length;

  const handleQuestComplete = async (id: string) => {
    try {
      await api.quests.complete(id);
      loadData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen pb-20 relative text-forge-text">
      <StarBackground />
      <DashboardNavbar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        xp={totalXP} 
        gold={totalGold}
        onLogout={() => {
          api.auth.logout();
          window.location.href = '/login';
        }}
      />

      <AddQuestModal
        isOpen={isAddQuestOpen}
        onClose={() => setIsAddQuestOpen(false)}
        onAdd={async (data) => {
          await api.quests.create(data);
          loadData();
        }}
      />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12">
        {currentView === 'hub' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column: Main Content */}
            <div className="col-span-1 md:col-span-8 flex flex-col gap-6 md:gap-8 order-2 md:order-1">
              <HeroHeader user={user} />
              
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={20} className="text-forge-accent" />
                    <h3 className="text-lg md:text-xl font-black tracking-tight">Active Quests</h3>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  {quests.filter(q => !q.completed).slice(0, 5).map(quest => (
                    <QuestItem 
                      key={quest.id} 
                      quest={quest} 
                      onComplete={handleQuestComplete}
                    />
                  ))}
                  {quests.filter(q => !q.completed).length === 0 && (
                    <div className="text-center p-8 md:p-12 glass-card border border-white/5 text-white/20 font-bold flex flex-col items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Plus size={24} />
                      </div>
                      <p className="text-sm">No active quests. Time to start something new.</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setIsAddQuestOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl md:rounded-[2rem] text-white/20 font-bold hover:border-white/10 hover:text-white/40 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus size={18} /> Add New Quest
                  </button>
                </div>

                {quests.filter(q => q.completed).length > 0 && (
                  <div className="flex flex-col gap-3 opacity-50 grayscale scale-[0.98]">
                    <div className="flex items-center gap-2 px-2">
                       <Check size={14} className="text-accent-green" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Completed Recently</span>
                    </div>
                    {quests.filter(q => q.completed).slice(0, 2).map(quest => (
                      <QuestItem 
                        key={quest.id} 
                        quest={quest} 
                        onComplete={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>

              <WorkProgress user={user} questsCompleted={questsCompleted} />
            </div>

            {/* Right Column: Sidebar Widgets */}
            <div className="col-span-1 md:col-span-4 flex flex-col gap-6 md:gap-8 order-1 md:order-2">
              <div className="grid grid-cols-1 gap-4">
                 <DailySignIn user={user} onClaim={loadData} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Completed" value={questsCompleted} colorClass="text-forge-accent" />
                <StatCard label="Gold" value={totalGold} colorClass="text-accent-yellow" />
              </div>
              
              <FocusSession />
              
              <div className="glass-card p-6 border-forge-accent/20 bg-forge-accent/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Quick Stats</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40 font-bold">Total Focus</span>
                    <span className="text-xs font-black">{(user.total_focus_seconds / 3600).toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40 font-bold">XP Level</span>
                    <span className="text-xs font-black">{Math.floor(totalXP / 1000)}.%</span>
                  </div>
                </div>
              </div>
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

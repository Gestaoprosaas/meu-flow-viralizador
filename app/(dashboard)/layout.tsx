"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import UpgradeModal from '../../components/dashboard/UpgradeModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [upgradeOpen, setUpgradeOpen] = useState<boolean>(false);

  const handleUpgradeToggle = () => {
    setUpgradeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] font-sans flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onUpgradeClick={handleUpgradeToggle}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header Toolbar */}
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onUpgradeClick={handleUpgradeToggle}
        />

        {/* Scrollable primary router viewport panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-20">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Pricing Upgrade Modal Popup */}
      <UpgradeModal 
        isOpen={upgradeOpen} 
        onClose={() => setUpgradeOpen(false)} 
      />

    </div>
  );
}

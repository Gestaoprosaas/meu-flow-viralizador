"use client";

import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Zap, FileText, ImageIcon, Video } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export default function AdminGeracoesPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/generations-stats');
        if (res.ok) {
          setChartData(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-red-500" />
          Estatísticas de Criação
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">Monitore o uso e consumo das criações por inteligência artificial em tempo real.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111118] border border-[#1E1E2E] p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8888AA]">Fila de Roteiros</span>
            <strong className="text-xl font-bold block text-white">Excelente</strong>
            <span className="text-[9px] text-[#555577] block">Tempo de resposta ~2.1s</span>
          </div>
        </div>

        <div className="bg-[#111118] border border-[#1E1E2E] p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8888AA]">Render Imagens</span>
            <strong className="text-xl font-bold block text-white">Estável</strong>
            <span className="text-[9px] text-[#555577] block">DALL-E / Flux API integrados</span>
          </div>
        </div>

        <div className="bg-[#111118] border border-[#1E1E2E] p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8888AA]">Motor Luma/Kling</span>
            <strong className="text-xl font-bold block text-white">Sincronic</strong>
            <span className="text-[9px] text-[#555577] block">Tempo médio ~25s por clip</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500" />
            Consumo Diário Consolidado (Últimos 7 dias)
          </h3>
          <span className="text-[10px] uppercase text-[#8888AA] font-bold">Unidades geradas</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-[#8888AA]">Calculando métricas volumétricas...</div>
        ) : (
          <div className="w-full h-80 bg-[#0A0A0F] border border-[#1E1E2E] p-2 rounded-xl">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#888" tickLine={false} />
                <YAxis stroke="#888" tickLine={false} />
                <Tooltip 
                  contentStyle={{ bgStyle: '#111118', background: '#111118', border: '1px solid #1E1E2E', borderRadius: '8px' }} 
                />
                <Legend />
                <Bar dataKey="Roteiros (Texto)" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Imagens" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Vídeos" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}

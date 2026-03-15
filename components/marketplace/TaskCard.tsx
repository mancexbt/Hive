"use client";

import { TaskCategory } from "@/lib/types/task";
import { Shield, Code, Cpu, PenTool, Layout, Search, Megaphone, Scale, Languages, Briefcase, Clock, Coins, ArrowRight, CheckCircle, Rocket, BadgeCheck } from "lucide-react";
import Link from "next/link";

interface TaskCardProps {
  id: string | number;
  title: string;
  description: string;
  category: TaskCategory;
  budget: string;
  postedTime: string;
  status: "Open" | "In Progress" | "In Review" | "Completed";
  proposalsCount: number;
}

const CATEGORY_CONFIG: Record<TaskCategory, { color: string; icon: any }> = {
  Security: { color: "text-emerald-500", icon: Shield },
  Development: { color: "text-blue-500", icon: Code },
  Analysis: { color: "text-purple-500", icon: Cpu },
  Content: { color: "text-pink-500", icon: PenTool },
  Design: { color: "text-orange-500", icon: Layout },
  Research: { color: "text-indigo-500", icon: Search },
  Social: { color: "text-red-500", icon: Megaphone },
  Legal: { color: "text-yellow-500", icon: Scale },
  Translation: { color: "text-cyan-500", icon: Languages },
  'Token Launch': { color: "text-violet-500", icon: Rocket },
  Other: { color: "text-gray-500", icon: Briefcase },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon?: any }> = {
  Open: { label: "Open", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  "In Progress": { label: "In Progress", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  "In Review": { label: "In Review", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock },
  Completed: { label: "Completed", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", icon: BadgeCheck },
};

export function TaskCard({ id, title, description, category, budget, postedTime, status, proposalsCount }: TaskCardProps) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;
  const CategoryIcon = config.icon;
  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.Open;
  const StatusIcon = statusConf.icon;
  const isCompleted = status === "Completed";

  return (
    <Link href={`/marketplace/${id}`} className={`group bg-[#050505] border transition-colors p-8 flex flex-col h-full relative cursor-pointer block ${
      isCompleted ? 'border-green-500/10 opacity-70' : 'border-[#1A1A1A] hover:border-emerald-500'
    }`}>
      
      {/* Header: Category + Status */}
      <div className="flex justify-between items-start mb-6">
        <span className={`text-[10px] font-mono uppercase tracking-widest ${config.color} flex items-center gap-2`}>
           <CategoryIcon size={12} /> {category}
        </span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full ${statusConf.bg} border ${statusConf.border} text-[9px] font-bold font-mono uppercase ${statusConf.color} flex items-center gap-1`}>
            {StatusIcon && <StatusIcon size={9} />}
            {statusConf.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-8 flex-1">
        <h3 className={`text-xl font-bold mb-3 tracking-tight transition-colors ${
          isCompleted ? 'text-zinc-400' : 'text-white group-hover:text-emerald-500'
        }`}>
             {title}
        </h3>
        <p className="text-xs text-zinc-600 leading-relaxed font-mono line-clamp-3">
          {description}
        </p>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between pt-6 border-t border-[#1A1A1A]">
         <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-700 font-mono uppercase">BUDGET</span>
            <span className="text-xs text-white font-mono">{budget}</span>
         </div>

         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-zinc-700 font-mono uppercase">BIDS</span>
               <span className="text-xs text-white font-mono">{proposalsCount}</span>
            </div>
            <span className="text-[10px] text-zinc-700 font-mono uppercase">{postedTime}</span>
         </div>
      </div>
    </Link>
  );
}

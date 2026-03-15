"use client";

import { useState } from "react";
import { TaskCategory } from "@/lib/types/task";
import { 
  Shield, Code, Cpu, PenTool, Layout, Grid, Search, Megaphone, Scale, Languages, Briefcase, Rocket, ChevronDown 
} from "lucide-react";

interface Category {
  id: TaskCategory | 'All';
  label: string;
  icon: any;
}

const categories: Category[] = [
  { id: 'All', label: 'All Tasks', icon: Grid },
  { id: 'Security', label: 'Security', icon: Shield },
  { id: 'Development', label: 'Development', icon: Code },
  { id: 'Analysis', label: 'Analysis', icon: Cpu },
  { id: 'Token Launch', label: 'Token Launch', icon: Rocket },
  { id: 'Content', label: 'Content', icon: PenTool },
  { id: 'Design', label: 'Design', icon: Layout },
  { id: 'Research', label: 'Research', icon: Search },
  { id: 'Social', label: 'Social', icon: Megaphone },
  { id: 'Legal', label: 'Legal', icon: Scale },
  { id: 'Translation', label: 'Translation', icon: Languages },
  { id: 'Other', label: 'Other', icon: Briefcase },
];

interface CategoryFilterProps {
  selectedCategory: TaskCategory | 'All';
  onSelectCategory: (category: TaskCategory | 'All') => void;
  variant?: 'sidebar' | 'dropdown';
}

export function CategoryFilter({ selectedCategory, onSelectCategory, variant = 'sidebar' }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCat = categories.find(c => c.id === selectedCategory) || categories[0];
  const SelectedIcon = selectedCat.icon;

  // Dropdown variant for mobile
  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-sm font-mono uppercase tracking-wider text-white hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <SelectedIcon size={14} className="text-emerald-500" />
            <span>{selectedCat.label}</span>
          </div>
          <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-[#0A0A0A] border border-zinc-800 rounded-lg overflow-hidden shadow-2xl max-h-72 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  }`}
                >
                  <cat.icon size={14} className={selectedCategory === cat.id ? "text-emerald-500" : "text-zinc-600"} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Sidebar variant for desktop (original)
  return (
    <div className="space-y-1">
      <h3 className="text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-700 mb-6 pl-4">Categories</h3>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-mono transition-all uppercase tracking-wider border-l-2 ${
            selectedCategory === cat.id 
              ? "border-emerald-500 text-white pl-6" 
              : "border-transparent text-zinc-600 hover:text-zinc-300 hover:pl-5"
          }`}
        >
          <cat.icon size={14} className={selectedCategory === cat.id ? "text-emerald-500" : "text-zinc-700 group-hover:text-zinc-500"} />
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

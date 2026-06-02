'use client';
import React from 'react';
import { useQueryStore } from '../../store/queryStore';
import { Download, Upload, Trash2, Undo2, Redo2 } from 'lucide-react';

export function QueryToolbar() {
  const queryTree = useQueryStore(state => state.queryTree);
  const setQueryTree = useQueryStore(state => state.setQueryTree);
  const clearQueryTree = useQueryStore(state => state.clearQueryTree);
  const undo = useQueryStore(state => state.undo);
  const redo = useQueryStore(state => state.redo);
  const historyIndex = useQueryStore(state => state.historyIndex);
  const history = useQueryStore(state => state.history);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(queryTree, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "query_patisserie_recipe.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (json.logic && json.children) {
            setQueryTree(json);
          } else {
            alert('Oh no! That recipe looks invalid!');
          }
        } catch {
          alert('Failed to read the recipe file!');
        }
      }
      reader.readAsText(file);
    };
    input.click();
  };

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="flex flex-wrap gap-2 items-center bg-white/60 p-1.5 pantry:p-2 rounded-xl backdrop-blur-sm border border-[#D4A373]/30 shadow-sm">
      <button onClick={undo} disabled={!canUndo} className="group relative cursor-pointer flex items-center gap-1 px-2.5 pantry:px-3 py-1.5 text-xs pantry:text-sm font-medium text-[#D4A373] hover:bg-[#F8F1E9] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
        <Undo2 size={16} className="shrink-0" />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3F2A1E] text-[#F8F1E9] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Undo Recipe</span>
      </button>
      <button onClick={redo} disabled={!canRedo} className="group relative cursor-pointer flex items-center gap-1 px-2.5 pantry:px-3 py-1.5 text-xs pantry:text-sm font-medium text-[#D4A373] hover:bg-[#F8F1E9] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
        <Redo2 size={16} className="shrink-0" />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3F2A1E] text-[#F8F1E9] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Redo Recipe</span>
      </button>
      <div className="w-px h-5 pantry:h-6 bg-[#D4A373]/20 mx-0.5 pantry:mx-1" />
      <button onClick={handleExport} className="group relative cursor-pointer flex items-center gap-2 px-2.5 pantry:px-3 py-1.5 text-xs pantry:text-sm font-medium text-[#D4A373] hover:bg-[#F8F1E9] rounded-lg transition-colors">
        <Download size={16} className="shrink-0" /> <span className="hidden pantry:inline">Export</span>
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3F2A1E] text-[#F8F1E9] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Export Recipe</span>
      </button>
      <button onClick={handleImport} className="group relative cursor-pointer flex items-center gap-2 px-2.5 pantry:px-3 py-1.5 text-xs pantry:text-sm font-medium text-[#D4A373] hover:bg-[#F8F1E9] rounded-lg transition-colors">
        <Upload size={16} className="shrink-0" /> <span className="hidden pantry:inline">Import</span>
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3F2A1E] text-[#F8F1E9] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Import Recipe</span>
      </button>
      <div className="w-px h-5 pantry:h-6 bg-[#D4A373]/20 mx-0.5 pantry:mx-1" />
      
      <button onClick={clearQueryTree} className="group relative cursor-pointer flex items-center gap-2 px-2.5 pantry:px-3 py-1.5 text-xs pantry:text-sm font-medium text-pink-400 hover:bg-pink-50 rounded-lg transition-colors">
        <Trash2 size={16} className="shrink-0" /> <span className="hidden pantry:inline">Clear Board</span>
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3F2A1E] text-[#F8F1E9] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Clear Board</span>
      </button>
    </div>
  );
}

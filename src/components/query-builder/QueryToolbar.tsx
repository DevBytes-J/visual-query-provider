'use client';
import React from 'react';
import { useQueryStore } from '../../store/queryStore';
import { Download, Upload, Trash2 } from 'lucide-react';

export function QueryToolbar() {
  const queryTree = useQueryStore(state => state.queryTree);
  const setQueryTree = useQueryStore(state => state.setQueryTree);
  const clearQueryTree = useQueryStore(state => state.clearQueryTree);

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
        } catch (err) {
          alert('Failed to read the recipe file!');
        }
      }
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="flex gap-2 items-center bg-white/60 p-2 rounded-xl backdrop-blur-sm border border-[#D4A373]/30 shadow-sm">
      <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#D4A373] hover:bg-[#F8F1E9] rounded-lg transition-colors" title="Download Recipe">
        <Download size={16} /> Export
      </button>
      <button onClick={handleImport} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#D4A373] hover:bg-[#F8F1E9] rounded-lg transition-colors" title="Upload Recipe">
        <Upload size={16} /> Import
      </button>
      <div className="w-px h-6 bg-[#D4A373]/20 mx-1" />
      <button onClick={clearQueryTree} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-pink-400 hover:bg-pink-50 rounded-lg transition-colors" title="Throw away everything">
        <Trash2 size={16} /> Clear Board
      </button>
    </div>
  );
}

'use client';

import React from 'react';
import { useQueryStore } from '../../store/queryStore';
import { GroupNode } from './GroupNode';

export function QueryCanvas() {
  const queryTree = useQueryStore((state) => state.queryTree);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#F8F1E9] min-h-[500px] rounded-3xl shadow-inner border border-[#D4A373]/20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3F2A1E] font-serif">Query Patisserie Board</h2>
        <div className="text-sm text-[#D4A373] bg-white/60 px-4 py-2 rounded-full shadow-sm">
          Bake complex queries. One delicious layer at a time.
        </div>
      </div>
      
      {/* Root Group Node (The very first giant cake box!) */}
      <GroupNode node={queryTree} isRoot={true} />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { useQueryStore } from '../../store/queryStore';
import { GroupNode } from './GroupNode';
import { SchemaSidebar } from './SchemaSidebar';
import { QueryPreview } from './QueryPreview';
import { QueryToolbar } from './QueryToolbar';
import { ResultsPanel } from './ResultsPanel';

export function QueryCanvas() {
  const queryTree = useQueryStore((state) => state.queryTree);
  const addCondition = useQueryStore((state) => state.addCondition);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + Shift + A to add rule to root
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        addCondition(queryTree.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addCondition, queryTree.id]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    // If we dropped a schema field onto a GroupNode Cake Box
    if (over.id.toString().startsWith('group-') && active.data.current?.field) {
      const groupId = over.id.toString().replace('group-', '');
      const fieldData = active.data.current.field;
      
      // Add a new condition to that group with the dragged ingredient's data!
      addCondition(groupId, fieldData.id, fieldData.type);
      return;
    }

    // Sortable reordering for conditions and groups
    if (active.data.current?.type && over.id !== active.id) {
      useQueryStore.getState().moveNode(active.id.toString(), over.id.toString());
    }
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-[600px] rounded-3xl shadow-xl border border-[#D4A373]/20 bg-[#F8F1E9] flex items-center justify-center">
        <div className="text-sm font-medium text-[#D4A373] animate-pulse">Loading Baking Station...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl pantry:text-4xl font-bold text-[#3F2A1E] font-serif">Query Patisserie Board</h2>
        <div className="text-sm pantry:text-base text-[#D4A373] bg-white/80 px-6 py-2 rounded-full shadow-sm border border-pink-200 mt-3 inline-block">
          Bake complex queries. One delicious layer at a time.
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <div className="flex flex-col pantry:flex-row w-full min-h-[600px] rounded-3xl shadow-xl border border-[#D4A373]/20 overflow-visible pantry:overflow-hidden bg-[#F8F1E9]">
          
          {/* Left Sidebar (Ingredients Shelf) */}
          <SchemaSidebar />

          {/* Main Canvas (Bakery Board) */}
          <div className="flex-1 p-4 pantry:p-8 bg-white/40 overflow-y-auto">
            <div className="mb-6 flex justify-end">
              {/* The Toolbar with our new Import/Export buttons! */}
              <div className="self-start pantry:self-auto">
                <QueryToolbar />
              </div>
            </div>
            
            {/* Root Group Node (The very first giant cake box!) */}
            <GroupNode node={queryTree} isRoot={true} />
            
            {/* Live Code Preview (Magic Receipt Printer!) */}
            <QueryPreview />

            {/* Results Panel Simulator */}
            <ResultsPanel />
          </div>
          
        </div>
      </DndContext>
    </div>
  );
}

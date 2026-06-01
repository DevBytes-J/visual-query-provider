'use client';

import React, { useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useQueryStore } from '../../store/queryStore';
import { GroupNode } from './GroupNode';
import { SchemaSidebar } from './SchemaSidebar';
import { QueryPreview } from './QueryPreview';
import { QueryToolbar } from './QueryToolbar';

export function QueryCanvas() {
  const queryTree = useQueryStore((state) => state.queryTree);
  const addCondition = useQueryStore((state) => state.addCondition);

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
    
    // If we dropped a schema field onto a GroupNode Cake Box
    if (over && over.id.toString().startsWith('group-') && active.data.current?.field) {
      const groupId = over.id.toString().replace('group-', '');
      const fieldData = active.data.current.field;
      
      // Add a new condition to that group with the dragged ingredient's data!
      addCondition(groupId, fieldData.id, fieldData.type);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex w-full max-w-6xl mx-auto min-h-[600px] rounded-3xl shadow-xl border border-[#D4A373]/20 overflow-hidden bg-[#F8F1E9]">
        
        {/* Left Sidebar (Ingredients Shelf) */}
        <SchemaSidebar />

        {/* Main Canvas (Bakery Board) */}
        <div className="flex-1 p-8 bg-white/40 overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#3F2A1E] font-serif">Query Patisserie Board</h2>
              <div className="text-sm text-[#D4A373] bg-white/80 px-4 py-2 rounded-full shadow-sm border border-pink-100 mt-2 inline-block">
                Bake complex queries. One delicious layer at a time.
              </div>
            </div>
            
            {/* The Toolbar with our new Import/Export buttons! */}
            <QueryToolbar />
          </div>
          
          {/* Root Group Node (The very first giant cake box!) */}
          <GroupNode node={queryTree} isRoot={true} />
          
          {/* Live Code Preview (Magic Receipt Printer!) */}
          <QueryPreview />
        </div>
        
      </div>
    </DndContext>
  );
}

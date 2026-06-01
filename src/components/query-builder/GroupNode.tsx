import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Group } from '../../types/query';
import { useQueryStore } from '../../store/queryStore';
import { ConditionNode } from './ConditionNode';
import { Plus, Trash2, FolderPlus, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupNodeProps {
  node: Group;
  parentId?: string;
  isRoot?: boolean;
}

export function GroupNode({ node, parentId, isRoot = false }: GroupNodeProps) {
  const { addCondition, addGroup, removeNode, updateGroupLogic, toggleGroupCollapse } = useQueryStore();
  
  // Make the Cake Box droppable!
  const { isOver, setNodeRef } = useDroppable({
    id: `group-${node.id}`,
  });

  return (
    <motion.div 
      layout
      ref={setNodeRef}
      className={`p-4 rounded-2xl border-2 ${isOver ? 'border-solid bg-pink-50' : 'border-dashed'} ${isRoot ? 'border-[#E89AB8] bg-[#F8F1E9]/50' : 'border-[#A8D5BA] bg-white/40'} flex flex-col gap-4 backdrop-blur-md transition-all overflow-hidden`}
    >
      {/* Group Header (Cake Box Labels) */}
      <div className="flex items-center gap-3">
        {/* Collapse Toggle */}
        <button 
          onClick={() => toggleGroupCollapse(node.id)}
          className="p-1 text-[#D4A373] hover:bg-white/60 rounded-md transition-colors"
          title={node.isCollapsed ? "Open box" : "Close box"}
        >
          {node.isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
        </button>

        <div className="flex bg-white/80 rounded-lg p-1 shadow-sm border border-pink-100">
          <button
            onClick={() => updateGroupLogic(node.id, 'AND')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${node.logic === 'AND' ? 'bg-[#E89AB8] text-white shadow-sm' : 'text-[#3F2A1E] hover:bg-pink-50'}`}
          >
            AND
          </button>
          <button
            onClick={() => updateGroupLogic(node.id, 'OR')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${node.logic === 'OR' ? 'bg-[#A8D5BA] text-white shadow-sm' : 'text-[#3F2A1E] hover:bg-green-50'}`}
          >
            OR
          </button>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <button onClick={() => addCondition(node.id)} className="flex items-center gap-1 px-3 py-1.5 bg-white/80 hover:bg-white text-[#3F2A1E] border border-pink-200 rounded-lg text-xs font-semibold shadow-sm transition-all" title="Add Macaron">
            <Plus size={14} className="text-[#E89AB8]" /> Add Rule
          </button>
          <button onClick={() => addGroup(node.id)} className="flex items-center gap-1 px-3 py-1.5 bg-white/80 hover:bg-white text-[#3F2A1E] border border-green-200 rounded-lg text-xs font-semibold shadow-sm transition-all" title="Add Cake Box">
            <FolderPlus size={14} className="text-[#A8D5BA]" /> Add Group
          </button>
          {!isRoot && parentId && (
            <button onClick={() => removeNode(node.id, parentId)} className="p-1.5 text-pink-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors shadow-sm" title="Throw away this cake box">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Children List (Animated Folding Magic!) */}
      <AnimatePresence initial={false}>
        {!node.isCollapsed && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-3 pl-4 border-l-2 border-pink-200/50 ml-2 min-h-[50px] overflow-hidden"
          >
            {node.children.length === 0 ? (
              <div className={`text-sm py-2 transition-colors ${isOver ? 'text-pink-500 font-bold' : 'text-pink-300 italic'}`}>
                {isOver ? 'Drop ingredient here!' : 'This cake box is empty! Drag an ingredient here.'}
              </div>
            ) : (
              <AnimatePresence>
                {node.children.map((child) => {
                  if ('logic' in child) {
                    return <GroupNode key={child.id} node={child} parentId={node.id} />;
                  }
                  return <ConditionNode key={child.id} node={child} parentId={node.id} />;
                })}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Small indicator when folded */}
      {node.isCollapsed && node.children.length > 0 && (
        <div className="pl-4 text-xs text-pink-300 font-medium italic">
          ... {node.children.length} delicious items hidden inside!
        </div>
      )}
    </motion.div>
  );
}

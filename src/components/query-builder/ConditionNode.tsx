import React from 'react';
import { Condition } from '../../types/query';
import { useQueryStore } from '../../store/queryStore';
import { Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConditionNodeProps {
  node: Condition;
  parentId: string;
}

export function ConditionNode({ node, parentId }: ConditionNodeProps) {
  const { removeNode, updateCondition } = useQueryStore();

  const isValid = node.field !== '' && node.value !== '';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow border ${isValid ? 'border-pink-200' : 'border-red-400 bg-red-50/50'}`}
    >
      {!isValid && (
        <AlertCircle size={16} className="text-red-400 shrink-0" title="Missing ingredient or value!" />
      )}

      {/* Field Input (Ingredient) */}
      <input
        type="text"
        placeholder="Ingredient (e.g. Age)"
        value={node.field}
        onChange={(e) => updateCondition(node.id, { field: e.target.value })}
        className="px-3 py-1.5 rounded-lg border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm text-[#3F2A1E] w-1/3"
      />

      {/* Operator Select (Tool) */}
      <select
        value={node.operator}
        onChange={(e) => updateCondition(node.id, { operator: e.target.value as any })}
        className="px-3 py-1.5 rounded-lg border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm text-[#3F2A1E]"
      >
        <option value="eq">Equals (=)</option>
        <option value="neq">Not Equals (!=)</option>
        <option value="gt">Greater Than (&gt;)</option>
        <option value="lt">Less Than (&lt;)</option>
        <option value="contains">Contains</option>
        <option value="startsWith">Starts With</option>
      </select>

      {/* Value Input (Amount) */}
      <input
        type="text"
        placeholder="Value (e.g. 18)"
        value={node.value}
        onChange={(e) => updateCondition(node.id, { value: e.target.value })}
        className="px-3 py-1.5 rounded-lg border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm text-[#3F2A1E] w-1/3"
      />

      {/* Delete Button (Throw away Macaron) */}
      <button 
        onClick={() => removeNode(node.id, parentId)}
        className="p-1.5 text-pink-400 hover:text-red-500 hover:bg-pink-50 rounded-lg transition-colors ml-auto shrink-0"
        title="Throw away this macaron"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}

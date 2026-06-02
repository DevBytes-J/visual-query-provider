import React from 'react';
import { Condition, Operator } from '../../types/query';
import { useQueryStore } from '../../store/queryStore';
import { Trash2, AlertCircle, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { bakerySchema } from '../../lib/schema';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ConditionNodeProps {
  node: Condition;
  parentId: string;
}

export function ConditionNode({ node, parentId }: ConditionNodeProps) {
  const { removeNode, updateCondition } = useQueryStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
    data: { type: 'Condition', node, parentId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isValid = node.field !== '' && node.value !== '' && node.value !== undefined;

  const schemaField = bakerySchema.find(f => f.id === node.field);
  const options = schemaField?.options || [];

  const getOperators = (): { value: Operator; label: string }[] => {
    switch (node.valueType) {
      case 'string':
        return [
          { value: 'eq', label: 'Equals (=)' },
          { value: 'neq', label: 'Not Equals (!=)' },
          { value: 'contains', label: 'Contains' },
          { value: 'startsWith', label: 'Starts With' },
        ];
      case 'number':
      case 'date':
        return [
          { value: 'eq', label: 'Equals (=)' },
          { value: 'neq', label: 'Not Equals (!=)' },
          { value: 'gt', label: 'Greater Than (>)' },
          { value: 'lt', label: 'Less Than (<)' },
          { value: 'between', label: 'Between' },
        ];
      case 'enum':
      case 'boolean':
        return [
          { value: 'eq', label: 'Equals (=)' },
          { value: 'neq', label: 'Not Equals (!=)' },
        ];
      default:
        return [{ value: 'eq', label: 'Equals (=)' }];
    }
  };

  const renderValueInput = () => {
    const baseClassName = "w-full sm:w-auto sm:flex-1 px-3 py-1.5 rounded-lg border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm text-[#3F2A1E]";
    
    if (node.valueType === 'boolean') {
      return (
        <select
          value={node.value === '' ? '' : String(node.value)}
          onChange={(e) => updateCondition(node.id, { value: e.target.value === 'true' })}
          className={baseClassName}
        >
          <option value="" disabled>Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
    }
    
    if (node.valueType === 'enum') {
      return (
        <select
          value={node.value === '' ? '' : String(node.value)}
          onChange={(e) => updateCondition(node.id, { value: e.target.value })}
          className={baseClassName}
        >
          <option value="" disabled>Select...</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (node.operator === 'between') {
      const valArr = Array.isArray(node.value) ? node.value : ['', ''];
      return (
        <div className="flex gap-2 w-full sm:w-auto sm:flex-1">
          <input
            type={node.valueType === 'date' ? 'date' : 'number'}
            value={valArr[0] as string | number}
            onChange={(e) => updateCondition(node.id, { value: [e.target.value, valArr[1]] })}
            className={baseClassName}
            placeholder="Min"
          />
          <span className="self-center text-pink-300">-</span>
          <input
            type={node.valueType === 'date' ? 'date' : 'number'}
            value={valArr[1] as string | number}
            onChange={(e) => updateCondition(node.id, { value: [valArr[0], e.target.value] })}
            className={baseClassName}
            placeholder="Max"
          />
        </div>
      );
    }

    return (
      <input
        type={node.valueType === 'date' ? 'date' : node.valueType === 'number' ? 'number' : 'text'}
        placeholder="Value"
        value={node.value as string | number}
        onChange={(e) => updateCondition(node.id, { value: node.valueType === 'number' ? Number(e.target.value) : e.target.value })}
        className={baseClassName}
      />
    );
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      ref={setNodeRef}
      style={style}
      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow border ${isValid ? 'border-pink-200' : 'border-red-400 bg-red-50/50'}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-[#D4A373] hover:text-pink-400 p-1 rounded-md transition-colors shrink-0">
        <GripVertical size={18} />
      </div>

      {!isValid && (
        <span title="Missing ingredient or value!">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
        </span>
      )}

      {/* Field Select (Ingredient) */}
      <div className="w-full sm:w-auto sm:flex-1 relative group">
        <select
          title="Choose an ingredient to filter by"
          value={node.field}
          onChange={(e) => {
            const fieldDef = bakerySchema.find(f => f.id === e.target.value);
            if (fieldDef) {
              updateCondition(node.id, { field: fieldDef.id, valueType: fieldDef.type, value: '', operator: 'eq' });
            }
          }}
          className="w-full px-3 py-1.5 rounded-lg border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm text-[#3F2A1E]"
        >
          <option value="" disabled>Select Ingredient...</option>
          {bakerySchema.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3F2A1E] text-[#F8F1E9] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">1. Pick an Ingredient</span>
      </div>

      {/* Operator Select (Tool) */}
      <div className="w-full sm:w-auto sm:flex-1 relative group">
        <select
          title="Choose how to compare the ingredient"
          value={node.operator}
          onChange={(e) => updateCondition(node.id, { operator: e.target.value as Operator })}
          className="w-full px-3 py-1.5 rounded-lg border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm text-[#3F2A1E]"
        >
          {getOperators().map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3F2A1E] text-[#F8F1E9] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">2. Pick a Rule</span>
      </div>

      {/* Value Input (Amount) */}
      <div className="w-full sm:w-auto sm:flex-1 relative group">
        {renderValueInput()}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3F2A1E] text-[#F8F1E9] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">3. Type the Value</span>
      </div>

      {/* Delete Button (Throw away Macaron) */}
      <button 
        onClick={() => removeNode(node.id)}
        className="group relative cursor-pointer p-1.5 text-pink-400 hover:text-red-500 hover:bg-pink-50 rounded-lg transition-colors sm:ml-auto self-end shrink-0"
      >
        <Trash2 size={16} />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3F2A1E] text-[#F8F1E9] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Delete Macaron</span>
      </button>
    </motion.div>
  );
}

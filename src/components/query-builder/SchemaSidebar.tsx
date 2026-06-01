'use client';
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { bakerySchema, SchemaField } from '../../lib/schema';
import { GripVertical } from 'lucide-react';

function DraggableIngredient({ field }: { field: SchemaField }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `schema-field-${field.id}`,
    data: { field }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 cursor-grab active:cursor-grabbing hover:bg-pink-50 hover:border-pink-300 transition-colors"
    >
      <GripVertical size={16} className="text-[#D4A373]" />
      <span className="text-sm font-medium text-[#3F2A1E]">{field.name}</span>
      <span className="text-xs text-pink-300 ml-auto bg-pink-50 px-2 py-0.5 rounded-full">{field.type}</span>
    </div>
  );
}

export function SchemaSidebar() {
  return (
    <div className="w-72 bg-[#F8F1E9]/80 backdrop-blur-md border-r border-[#D4A373]/20 p-6 flex flex-col gap-4 min-h-[600px] rounded-l-3xl">
      <h3 className="text-lg font-bold text-[#3F2A1E] font-serif border-b border-pink-200 pb-2">Ingredients</h3>
      <p className="text-xs text-pink-400">Drag an ingredient into a Cake Box to create a new rule!</p>
      
      <div className="flex flex-col gap-3 mt-4">
        {bakerySchema.map(field => (
          <DraggableIngredient key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
}

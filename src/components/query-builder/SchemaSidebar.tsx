'use client';
import { useDraggable } from '@dnd-kit/core';
import { bakerySchema, SchemaField } from '../../lib/schema';
import { GripVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function DraggableIngredient({ field, isDuplicate }: { field: SchemaField; isDuplicate?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: isDuplicate ? `schema-field-dup-${field.id}` : `schema-field-${field.id}`,
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
      className={`flex items-center gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 cursor-grab active:cursor-grabbing hover:bg-pink-50 hover:border-pink-300 transition-all shrink-0 min-w-[150px] pantry:min-w-0 pantry:w-full ${isDuplicate ? 'pantry:hidden' : ''}`}
    >
      <GripVertical size={16} className="text-[#D4A373] shrink-0" />
      <span className="text-sm font-medium text-[#3F2A1E] truncate">{field.name}</span>
      <span className="text-[10px] text-pink-300 ml-auto bg-pink-50 px-2 py-0.5 rounded-full shrink-0">{field.type}</span>
    </div>
  );
}

export function SchemaSidebar() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;

    const scroll = () => {
      const isMobile = window.innerWidth < 1300; // matches --breakpoint-pantry
      if (isMobile && speed > 0 && !isHovered) {
        // Use an integer increment to prevent fractional rounding lockups
        container.scrollLeft += speed;

        // Reset scroll seamlessly when reaching the duplicate set
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth - 1) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, isHovered]);

  return (
    <div className="w-full pantry:w-72 sticky top-0 z-20 bg-[#F8F1E9]/80 backdrop-blur-md border-b pantry:border-b-0 pantry:border-r border-[#D4A373]/20 p-4 pantry:p-6 flex flex-col gap-2 pantry:gap-4 rounded-t-3xl pantry:rounded-t-none pantry:rounded-l-3xl">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base pantry:text-lg font-bold text-[#3F2A1E] font-serif pantry:border-b pantry:border-pink-200 pantry:pb-2 flex-1">
            Ingredients
          </h3>
          
          {/* Speed slider visible only on mobile/carousel view */}
          <div className="flex items-center gap-1.5 text-[10px] text-[#D4A373] pantry:hidden bg-white/60 px-2 py-1 rounded-lg border border-pink-100 shadow-sm">
            <span>Speed:</span>
            <input 
              type="range" 
              min="0" 
              max="6" 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))} 
              className="w-12 h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-400"
            />
            <span className="font-mono min-w-[12px] text-right">{speed}x</span>
          </div>
        </div>
        <p className="text-[10px] pantry:text-xs text-pink-400 mt-0.5">Drag an ingredient into a Cake Box to create a new rule!</p>
      </div>
      
      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="flex flex-row pantry:flex-col gap-3 mt-2 pantry:mt-4 overflow-x-auto pantry:overflow-x-visible pb-2 pantry:pb-0 scrollbar-thin scrollbar-thumb-pink-100"
      >
        {bakerySchema.map(field => (
          <DraggableIngredient key={field.id} field={field} />
        ))}
        {bakerySchema.map(field => (
          <DraggableIngredient key={`dup-${field.id}`} field={field} isDuplicate={true} />
        ))}
      </div>
    </div>
  );
}

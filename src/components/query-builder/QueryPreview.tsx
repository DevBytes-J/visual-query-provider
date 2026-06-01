'use client';
import React, { useState } from 'react';
import { useQueryStore } from '../../store/queryStore';
import { generateSQL, generateMongo, generateGraphQL } from '../../lib/queryEngine';
import { Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function QueryPreview() {
  const queryTree = useQueryStore(state => state.queryTree);
  const [dialect, setDialect] = useState<'SQL' | 'Mongo' | 'GraphQL'>('SQL');

  let codeOutput = '';
  try {
    if (dialect === 'SQL') {
      codeOutput = generateSQL(queryTree) || '-- Start dropping ingredients to bake a query!';
    } else if (dialect === 'Mongo') {
      const mongoObj = generateMongo(queryTree);
      codeOutput = Object.keys(mongoObj).length ? JSON.stringify(mongoObj, null, 2) : '// Start dropping ingredients to bake a query!';
    } else {
      const gqlObj = generateGraphQL(queryTree);
      codeOutput = Object.keys(gqlObj).length ? JSON.stringify(gqlObj, null, 2) : '// Start dropping ingredients to bake a query!';
    }
  } catch (e) {
    codeOutput = '// The kitchen is messy! Error generating query.';
  }

  return (
    <div className="w-full mt-8 bg-[#2A1B12] rounded-2xl overflow-hidden shadow-xl border-4 border-[#F8F1E9]">
      {/* Header (Receipt Printer Labels) */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#1F140D] border-b border-[#4A3525]">
        <h3 className="text-pink-200 font-bold font-serif flex items-center gap-2">
          <Code size={18} className="text-[#D4A373]" /> Magic Receipt Printer
        </h3>
        
        {/* Magic Buttons to switch language */}
        <div className="flex gap-2">
          {['SQL', 'Mongo', 'GraphQL'].map((d) => (
            <button
              key={d}
              onClick={() => setDialect(d as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                dialect === d 
                  ? 'bg-pink-400 text-[#1F140D] shadow-[0_0_12px_rgba(244,114,182,0.4)]' 
                  : 'text-pink-200/50 hover:text-pink-200 hover:bg-[#3F2A1E]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      
      {/* Code Area (Where the magic words appear!) */}
      <div className="p-6 relative min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.pre
            key={dialect + codeOutput}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="font-mono text-sm text-[#A8D5BA] whitespace-pre-wrap break-all"
          >
            {codeOutput}
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { useQueryStore } from '../../store/queryStore';
import { evaluateQuery } from '../../lib/queryEngine';
import { mockBakeryData, BakeryItem } from '../../lib/mockBakeryData';
import { Play, Utensils, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ResultsPanel() {
  const queryTree = useQueryStore(state => state.queryTree);
  const [results, setResults] = useState<BakeryItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(null);
  }, [queryTree]);

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = evaluateQuery(mockBakeryData, queryTree);
      setResults(filtered);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full mt-8 bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border-2 border-pink-200">
      <div className="flex items-center justify-between px-3 sm:px-6 py-4 bg-[#F8F1E9] border-b border-pink-100">
        <h3 className="text-sm sm:text-base text-[#3F2A1E] font-bold flex items-center gap-1 sm:gap-2 whitespace-nowrap">
          <Utensils size={18} className="text-[#D4A373] w-4 h-4 sm:w-auto sm:h-auto shrink-0" /> Tasting Table
        </h3>
        
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-[#E89AB8] hover:bg-pink-400 text-white rounded-full text-xs sm:text-sm font-bold shadow-md transition-all disabled:opacity-70 whitespace-nowrap shrink-0 ml-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin w-3 h-3 sm:w-4 sm:h-4 shrink-0" /> : <Play size={16} className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />}
          {loading ? 'Baking...' : 'Bake & Taste!'}
        </button>
      </div>
      
      <div className="p-6 min-h-[200px] flex flex-col">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-pink-300 py-10"
            >
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="italic text-lg">Baking your results in the oven...</p>
            </motion.div>
          )}

          {!loading && results === null && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-[#D4A373] py-10"
            >
              <Utensils size={40} className="mb-4 opacity-50" />
              <p className="italic text-lg">Click &quot;Bake &amp; Taste&quot; to see what comes out of the oven!</p>
            </motion.div>
          )}

          {!loading && results !== null && results.length === 0 && (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-[#D4A373] py-10"
            >
              <span className="text-4xl mb-4">💨</span>
              <p className="italic text-lg">Oh no! The recipe matched nothing. The oven is empty.</p>
            </motion.div>
          )}

          {!loading && results !== null && results.length > 0 && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="text-sm font-medium text-pink-400">
                Freshly baked: {results.length} item{results.length > 1 ? 's' : ''}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-pink-100">
                      <th className="py-3 px-4 text-[#3F2A1E] font-bold">Pastry Name</th>
                      <th className="py-3 px-4 text-[#3F2A1E] font-bold">Batch Date</th>
                      <th className="py-3 px-4 text-[#3F2A1E] font-bold">Inventory</th>
                      <th className="py-3 px-4 text-[#3F2A1E] font-bold">Status</th>
                      <th className="py-3 px-4 text-[#3F2A1E] font-bold">Vegan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((item, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="border-b border-pink-50 hover:bg-pink-50/50 transition-colors text-sm text-[#5C4535]"
                      >
                        <td className="py-3 px-4 font-medium">{item.pastry_name}</td>
                        <td className="py-3 px-4">{item.batch_date}</td>
                        <td className="py-3 px-4">{item.inventory_level}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            item.status === 'Fresh' ? 'bg-green-100 text-green-700' :
                            item.status === 'Baking' ? 'bg-yellow-100 text-yellow-700' :
                            item.status === 'Sold Out' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{item.is_vegan ? '🌱 Yes' : 'No'}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

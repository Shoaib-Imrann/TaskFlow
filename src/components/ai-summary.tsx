'use client';

import { Sparkles, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';

interface AISummaryData {
  summary: string;
  stats: {
    completed_this_week: number;
    pending: number;
    overdue: number;
  };
}

export function AISummary() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<AISummaryData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = () => {
    setLoading(true);
    axiosInstance.get('/api/ai/summary')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!data && !loading) {
      fetchSummary();
    }
  };

  return (
    <>
      {/* AI Summary Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)]"
            >
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden min-h-[400px]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Sparkles className="w-4 h-4" />
                    <div>
                      <h3 className="font-medium text-sm">Weekly Summary</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Gemini 1.5 Flash</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col min-h-[327px]">
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                    </div>
                  ) : data ? (
                    <>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-relaxed mb-4">{data.summary}</p>
                        <div className="flex gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3 mt-3">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span>{data.stats.completed_this_week} completed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            <span>{data.stats.pending} pending</span>
                          </div>
                          {data.stats.overdue > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              <span className="text-red-600">{data.stats.overdue} overdue</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={fetchSummary}
                        disabled={loading}
                        variant="ghost"
                        size="sm"
                        className="w-full gap-1.5 text-xs h-8 text-gray-900 bg-blue-50 hover:bg-blue-100 hover:text-gray-950"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Refresh
                      </Button>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <p className="text-sm text-gray-500 mb-4">Generate your weekly productivity summary</p>
                      <Button
                        onClick={fetchSummary}
                        size="sm"
                        className="gap-1.5 h-9"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating AI Button */}
      {!isOpen && (
        <motion.button
          onClick={handleOpen}
          className="fixed bottom-4 right-4 z-[60] w-12 cursor-pointer h-12 rounded-full bg-blue-600 shadow-md hover:shadow-lg flex items-center justify-center text-white transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-4.5 h-4.5" />
        </motion.button>
      )}
    </>
  );
}

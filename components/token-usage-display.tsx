"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { motion } from "framer-motion";

interface TokenUsageData {
  total_input_tokens: number;
  total_output_tokens: number;
  total_cache_write_tokens: number;
  total_cache_read_tokens: number;
  total_cost_usd: number;
  total_api_calls: number;
}

interface TokenUsageDisplayProps {
  usage: TokenUsageData | null;
  loading?: boolean;
}

export function TokenUsageDisplay({ usage, loading = false }: TokenUsageDisplayProps) {
  if (!usage && !loading) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-2"
    >
      <Card className="p-2 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left side - Token metrics */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Input Tokens */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900">
                <ArrowDownToLine className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                  {loading ? "..." : formatNumber(usage?.total_input_tokens || 0)}
                </span>
                <span className="text-xs text-blue-700 dark:text-blue-300">Input</span>
              </div>
            </div>

            {/* Cache Read */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900">
                <Database className="w-3 h-3 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-green-900 dark:text-green-100">
                  {loading ? "..." : formatNumber(usage?.total_cache_read_tokens || 0)}
                </span>
                <span className="text-xs text-green-700 dark:text-green-300">Cache Read</span>
              </div>
            </div>

            {/* Cache Write */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900">
                <Database className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                  {loading ? "..." : formatNumber(usage?.total_cache_write_tokens || 0)}
                </span>
                <span className="text-xs text-amber-700 dark:text-amber-300">Cache Write</span>
              </div>
            </div>

            {/* Output Tokens */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900">
                <ArrowUpFromLine className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-purple-900 dark:text-purple-100">
                  {loading ? "..." : formatNumber(usage?.total_output_tokens || 0)}
                </span>
                <span className="text-xs text-purple-700 dark:text-purple-300">Output</span>
              </div>
            </div>
          </div>

          {/* Right side - API Calls */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {loading ? "..." : usage?.total_api_calls || 0} calls
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

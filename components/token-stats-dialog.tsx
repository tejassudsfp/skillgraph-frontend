"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Database, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface ModelUsage {
  provider: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_write_tokens: number;
  cache_read_tokens: number;
  cost: number;
  calls: number;
}

interface TokenUsageData {
  total_input_tokens: number;
  total_output_tokens: number;
  total_cache_write_tokens: number;
  total_cache_read_tokens: number;
  total_cost_usd: number;
  total_api_calls: number;
  models?: ModelUsage[];
}

interface TokenStatsDialogProps {
  usage: TokenUsageData | null;
  loading?: boolean;
}

export function TokenStatsDialog({ usage, loading = false }: TokenStatsDialogProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getModelDisplayName = (provider: string, model: string) => {
    // Simplify model names for display
    if (provider === "anthropic") {
      if (model.includes("sonnet")) return "Claude Sonnet";
      if (model.includes("haiku")) return "Claude Haiku";
      if (model.includes("opus")) return "Claude Opus";
    }
    if (provider === "openai") {
      if (model.includes("gpt-4o-mini")) return "GPT-4o Mini";
      if (model.includes("gpt-4o")) return "GPT-4o";
    }
    if (provider === "together") {
      if (model.includes("Llama")) return "Llama 3.3 70B";
      if (model.includes("QwQ")) return "QwQ 32B";
    }
    if (provider === "user_input") {
      return "User Messages";
    }
    return model;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-2 text-xs font-medium"
          style={{
            borderColor: "#2d2d2d",
            backgroundColor: "#fff9ef",
            color: "#2d2d2d",
          }}
        >
          <BarChart3 className="w-4 h-4 mr-1" />
          Token Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Token Usage Statistics</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8 text-sm" style={{ color: "#6a6a6a" }}>
            Loading statistics...
          </div>
        ) : !usage ? (
          <div className="text-center py-8 text-sm" style={{ color: "#6a6a6a" }}>
            No usage data available for this conversation
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Summary */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "#2d2d2d" }}>
                Overall Summary
              </h3>
              <Card className="p-4" style={{ borderColor: "#d0d0d0", backgroundColor: "#fff9ef" }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowDownToLine className="w-4 h-4" style={{ color: "#2d2d2d" }} />
                      <span className="text-xs" style={{ color: "#6a6a6a" }}>Input</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#2d2d2d" }}>
                      {formatNumber(usage.total_input_tokens)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4" style={{ color: "#2d2d2d" }} />
                      <span className="text-xs" style={{ color: "#6a6a6a" }}>Cache Read</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#2d2d2d" }}>
                      {formatNumber(usage.total_cache_read_tokens)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4" style={{ color: "#2d2d2d" }} />
                      <span className="text-xs" style={{ color: "#6a6a6a" }}>Cache Write</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#2d2d2d" }}>
                      {formatNumber(usage.total_cache_write_tokens)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowUpFromLine className="w-4 h-4" style={{ color: "#2d2d2d" }} />
                      <span className="text-xs" style={{ color: "#6a6a6a" }}>Output</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#2d2d2d" }}>
                      {formatNumber(usage.total_output_tokens)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t-2" style={{ borderColor: "#d0d0d0" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "#6a6a6a" }}>
                      Total API Calls
                    </span>
                    <Badge variant="secondary" className="text-sm">
                      {usage.total_api_calls}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* Model-wise Breakdown */}
            {usage.models && usage.models.filter(m => m.provider !== "user_input").length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#2d2d2d" }}>
                  Model-wise Breakdown
                </h3>
                <div className="space-y-3">
                  {usage.models.filter(m => m.provider !== "user_input").map((model, idx) => (
                    <Card
                      key={idx}
                      className="p-4"
                      style={{ borderColor: "#d0d0d0", backgroundColor: "#fff9ef" }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-sm" style={{ color: "#2d2d2d" }}>
                            {getModelDisplayName(model.provider, model.model)}
                          </h4>
                          <p className="text-xs mt-1" style={{ color: "#6a6a6a" }}>
                            {model.provider} • {model.calls} calls
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="block mb-1" style={{ color: "#6a6a6a" }}>Input</span>
                          <span className="font-semibold" style={{ color: "#2d2d2d" }}>
                            {formatNumber(model.input_tokens)}
                          </span>
                        </div>
                        <div>
                          <span className="block mb-1" style={{ color: "#6a6a6a" }}>Cache Read</span>
                          <span className="font-semibold" style={{ color: "#2d2d2d" }}>
                            {formatNumber(model.cache_read_tokens)}
                          </span>
                        </div>
                        <div>
                          <span className="block mb-1" style={{ color: "#6a6a6a" }}>Cache Write</span>
                          <span className="font-semibold" style={{ color: "#2d2d2d" }}>
                            {formatNumber(model.cache_write_tokens)}
                          </span>
                        </div>
                        <div>
                          <span className="block mb-1" style={{ color: "#6a6a6a" }}>Output</span>
                          <span className="font-semibold" style={{ color: "#2d2d2d" }}>
                            {formatNumber(model.output_tokens)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

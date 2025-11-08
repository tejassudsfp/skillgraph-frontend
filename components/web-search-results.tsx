"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search, Globe, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface SearchResult {
  url: string;
  title: string;
  excerpts: string[];
}

interface SearchQueryResults {
  query: string;
  results: SearchResult[];
}

interface WebSearchResultsProps {
  data: {
    query: string;
    search_queries: string[];
    results: SearchQueryResults[];
    num_results: number;
  };
  cached?: boolean;
}

export function WebSearchResults({ data, cached = false }: WebSearchResultsProps) {
  // Flatten all results from all queries
  const allResults = data.results.flatMap((queryResult) =>
    queryResult.results.map(result => ({
      ...result,
      searchQuery: queryResult.query
    }))
  );

  // Deduplicate by URL
  const uniqueResults = Array.from(
    new Map(allResults.map(item => [item.url, item])).values()
  );

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Web Search Results</h3>
            <p className="text-xs text-muted-foreground">
              {uniqueResults.length} sources found
            </p>
          </div>
        </div>
        {cached && (
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            Cached
          </Badge>
        )}
      </div>

      {/* Search Queries Used */}
      <div className="flex flex-wrap gap-2">
        {data.search_queries.map((query, idx) => (
          <Badge key={idx} variant="outline" className="gap-1 text-xs">
            <Search className="w-3 h-3" />
            {query}
          </Badge>
        ))}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {uniqueResults.map((result, idx) => (
          <motion.div
            key={result.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <SearchResultCard result={result} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface SearchResultCardProps {
  result: SearchResult & { searchQuery?: string };
}

function SearchResultCard({ result }: SearchResultCardProps) {
  // Extract domain from URL
  const domain = new URL(result.url).hostname.replace('www.', '');

  // Get first excerpt for preview
  const preview = result.excerpts[0]?.substring(0, 150) || "No preview available";

  // Generate a favicon URL (using Google's favicon service as fallback)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 space-y-3"
      >
        {/* Header with Favicon and Domain */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <img
              src={faviconUrl}
              alt={`${domain} favicon`}
              className="w-5 h-5"
              onError={(e) => {
                // Fallback to globe icon if favicon fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<svg class="w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {result.title}
              </h4>
              <ExternalLink className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Globe className="w-3 h-3" />
              {domain}
            </p>
          </div>
        </div>

        {/* Preview Text */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {preview}...
        </p>

        {/* Excerpt Count Badge */}
        {result.excerpts.length > 1 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {result.excerpts.length} excerpts
            </Badge>
          </div>
        )}

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/20 rounded-lg transition-colors pointer-events-none" />
      </a>
    </Card>
  );
}

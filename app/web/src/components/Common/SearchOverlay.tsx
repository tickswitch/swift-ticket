import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { GetSingleData } from '@/API/API';
import { useNavigate } from 'react-router';
import { sortByDistance } from '@/lib/sortByDistance';
import { cn } from '@/lib/utils';
import Loader from './Loader';

interface RecentItem {
  id: string;
  name: string;
  date?: string;
  venue?: string;
}

const TRENDING = [
  'Lollapalooza India',
  'Sunburn Festival',
  'NH7 Weekender',
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'cities'>('events');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto-focus on open; clear query on close
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    } else {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Debounce 400ms (same as existing Header)
  useEffect(() => {
    const h = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(h);
  }, [query]);

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState<RecentItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('recentlyViewed') || '[]').slice(0, 3); }
    catch { return []; }
  });
  const clearRecent = () => { localStorage.removeItem('recentlyViewed'); setRecentlyViewed([]); };

  // ── Search queries (identical to the original Header logic) ────────────────
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useQuery({
    queryKey: ['search-events', debouncedQuery],
    queryFn: () => GetSingleData(`search-events?keyword=${encodeURIComponent(debouncedQuery)}`),
    enabled: !!debouncedQuery && activeTab === 'events',
  });

  const { data: citiesData, isLoading: citiesLoading, error: citiesError } = useQuery({
    queryKey: ['cities', debouncedQuery],
    queryFn: () => GetSingleData(`cities/search?query=${debouncedQuery}`),
    enabled: !!debouncedQuery && activeTab === 'cities',
  });

  const userCoords = JSON.parse(localStorage.getItem('selectedLocationCoords') || 'null');
  const rawEvents: any[] = eventsData?.data?.events ?? (Array.isArray(eventsData?.data) ? eventsData.data : []);
  const eventResults = sortByDistance(rawEvents, userCoords?.lat, userCoords?.lon);
  const cityResults: any[] = citiesData?.cities ?? [];
  const isLoading  = activeTab === 'events' ? eventsLoading  : citiesLoading;
  const hasError   = activeTab === 'events' ? eventsError    : citiesError;

  const city = localStorage.getItem('selectedLocation') ?? 'your city';

  const handleEventClick = useCallback((id: string) => {
    onClose();
    navigate(`/event-details/${id}`);
  }, [navigate, onClose]);

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-0 z-[200] bg-black/50 backdrop-blur-[2px] transition-opacity duration-200',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Search panel ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed z-[201] transition-all duration-200 ease-out',
          // Mobile: full screen
          'inset-0',
          // Desktop: floating card centred below nav
          'md:inset-auto md:top-[68px] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl md:px-4',
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
      >
        <div className="flex flex-col h-full md:h-auto bg-white/80 backdrop-blur-md md:rounded-2xl shadow-2xl border border-white/30 overflow-hidden">

          {/* Input row */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/70 flex-shrink-0">
            <Search size={20} className="text-[#2563EB] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, artists or venues..."
              className="flex-1 bg-transparent outline-none text-gray-900 text-base placeholder-gray-400 font-medium"
              data-testid="search-overlay-input"
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close search"
              data-testid="search-overlay-close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 md:max-h-[70vh]">
            {debouncedQuery ? (
              /* ── Results ─────────────────────────────────────────────── */
              <>
                {/* Tabs */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50/60">
                  {(['events', 'cities'] as const).map((tab) => (
                    <button
                      key={tab}
                      onMouseDown={(e) => { e.preventDefault(); setActiveTab(tab); }}
                      className={cn(
                        'text-sm font-semibold px-3 py-1 rounded-full capitalize transition-colors',
                        activeTab === tab
                          ? 'bg-[#2563EB] text-white'
                          : 'text-[#2563EB] hover:bg-[#2563EB]/10',
                      )}
                      data-testid={`search-tab-${tab}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {isLoading && (
                  <div className="flex justify-center py-10">
                    <Loader parentClass="h-fit" size={28} />
                  </div>
                )}
                {hasError && (
                  <p className="px-4 py-3 text-red-500 text-sm text-center">Failed to load suggestions</p>
                )}

                {/* Event results */}
                {activeTab === 'events' && !isLoading && eventResults.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onMouseDown={() => handleEventClick(item.id)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                    data-testid={`search-event-result-${idx}`}
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#2563EB] text-xs font-bold">TM</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-black truncate">{item.title ?? item.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {[item.date, item.venue, item.location].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>
                ))}
                {activeTab === 'events' && !isLoading && !hasError && eventResults.length === 0 && (
                  <p className="px-4 py-6 text-sm text-gray-500 text-center">No results for "{debouncedQuery}"</p>
                )}

                {/* City results */}
                {activeTab === 'cities' && !isLoading && cityResults.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onMouseDown={() => {
                      onClose();
                      navigate(`/events?lat=${item.latitude}&lng=${item.longitude}`);
                      window.location.reload();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                    data-testid={`search-city-result-${idx}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">{item.city}</p>
                      <p className="text-xs text-gray-500">{item.country}</p>
                    </div>
                  </div>
                ))}
                {activeTab === 'cities' && !isLoading && !hasError && cityResults.length === 0 && (
                  <p className="px-4 py-6 text-sm text-gray-500 text-center">No cities found for "{debouncedQuery}"</p>
                )}
              </>
            ) : (
              /* ── No query: recently viewed + trending ──────────────── */
              <div className="py-2">
                {/* Recently viewed */}
                {recentlyViewed.length > 0 && (
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <Clock size={13} /> Recently viewed
                      </span>
                      <button
                        onClick={clearRecent}
                        className="text-xs text-[#2563EB] hover:underline"
                        data-testid="search-clear-recent"
                      >
                        Clear all
                      </button>
                    </div>
                    {recentlyViewed.map((item) => (
                      <div
                        key={item.id}
                        onMouseDown={() => { onClose(); navigate(`/event-details/${item.id}`); }}
                        className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-xl hover:bg-gray-50/80 cursor-pointer transition-colors"
                        data-testid={`search-recent-item-${item.id}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Clock size={14} className="text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                          {(item.date || item.venue) && (
                            <p className="text-xs text-gray-400 truncate">
                              {[item.date, item.venue].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trending */}
                <div className={cn('px-4 py-3', recentlyViewed.length > 0 && 'border-t border-gray-100/70')}>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    <TrendingUp size={13} /> Trending in {city}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((label) => (
                      <button
                        key={label}
                        onMouseDown={() => setQuery(label)}
                        className="px-3 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-medium hover:bg-[#2563EB]/20 transition-colors"
                        data-testid={`search-trending-${label.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

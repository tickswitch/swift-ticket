import { ChevronDown, Calendar, Tag, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ─── Shared design tokens ────────────────────────────────────────────────────
const PILL =
  'flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/30 bg-white/70 backdrop-blur-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-gray-700 text-sm font-medium hover:bg-white/90 transition-all duration-200 outline-none whitespace-nowrap';
const PILL_ACTIVE =
  'flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#2563EB] bg-[#2563EB] text-white text-sm font-medium transition-all duration-200 outline-none whitespace-nowrap';

// ─── Sort ─────────────────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { label: 'Soonest first', value: 'date,asc' },
  { label: 'Most popular', value: 'relevance,desc' },
  { label: 'Lowest price', value: 'vpiScore,asc' },
];

export const SortDropdown = ({
  sort,
  onSortChange,
}: {
  sort: string;
  onSortChange: (v: string) => void;
}) => {
  const label = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Soonest first';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={PILL} data-testid="sort-dropdown-trigger">
          {label}
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white border border-gray-200 rounded-xl shadow-lg min-w-[160px] p-1"
      >
        {SORT_OPTIONS.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${
              sort === option.value ? 'bg-gray-100 font-semibold text-black' : 'text-gray-700 hover:bg-gray-50'
            }`}
            data-testid={`sort-option-${option.value.replace(',', '-')}`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Date options ─────────────────────────────────────────────────────────────
const DATE_OPTIONS = [
  { label: 'Anytime',    value: 'anytime'    },
  { label: 'Today',      value: 'today'      },
  { label: 'Tomorrow',   value: 'tomorrow'   },
  { label: 'This week',  value: 'this-week'  },
  { label: 'This month', value: 'this-month' },
];

const CATEGORY_OPTIONS = ['Category', 'Concerts', 'Festivals', 'Sports', 'Theater'];

// ─── GenreFiltersBar ──────────────────────────────────────────────────────────
interface GenreFiltersBarProps {
  period: string;
  onPeriodChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

/**
 * Unified glassmorphism filter bar for genre "See all" pages.
 * Matches the visual design of EventFiltersBar / ExploreAllEvents.
 */
export const GenreFiltersBar = ({
  period,
  onPeriodChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: GenreFiltersBarProps) => {
  const locationLabel =
    typeof window !== 'undefined' ? localStorage.getItem('selectedLocation') : null;

  const dateLabel = DATE_OPTIONS.find(o => o.value === period)?.label ?? 'Date';
  const isDateActive = period !== 'anytime';
  const isCatActive  = category !== 'Category';

  return (
    <div className="flex flex-wrap items-center gap-3 py-4" data-testid="genre-filters-bar">
      {/* Location — read-only pill styled to match LocationDropdown trigger */}
      {locationLabel && (
        <span
          className={PILL + ' cursor-default'}
          data-testid="genre-location-pill"
        >
          <MapPin size={16} />
          {locationLabel}
        </span>
      )}

      {/* Date dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={isDateActive ? PILL_ACTIVE : PILL}
            data-testid="genre-filter-date"
          >
            <Calendar size={16} />
            {dateLabel}
            <ChevronDown size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-white border border-gray-200 rounded-xl shadow-lg min-w-[160px] p-1"
        >
          {DATE_OPTIONS.map(opt => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onPeriodChange(opt.value)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${
                period === opt.value ? 'bg-gray-100 font-semibold text-black' : 'text-gray-700 hover:bg-gray-50'
              }`}
              data-testid={`genre-date-option-${opt.value}`}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Category dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={isCatActive ? PILL_ACTIVE : PILL}
            data-testid="genre-filter-category"
          >
            <Tag size={16} />
            {category}
            <ChevronDown size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-white border border-gray-200 rounded-xl shadow-lg min-w-[160px] p-1"
        >
          {CATEGORY_OPTIONS.map(opt => (
            <DropdownMenuItem
              key={opt}
              onClick={() => onCategoryChange(opt)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${
                category === opt ? 'bg-gray-100 font-semibold text-black' : 'text-gray-700 hover:bg-gray-50'
              }`}
              data-testid={`genre-category-option-${opt.toLowerCase()}`}
            >
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort — right-aligned */}
      <div className="ml-auto">
        <SortDropdown sort={sort} onSortChange={onSortChange} />
      </div>
    </div>
  );
};

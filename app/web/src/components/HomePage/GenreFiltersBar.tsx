import { ChevronDown, MapPin } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SORT_OPTIONS = [
  { label: 'Soonest first', value: 'date,asc' },
  { label: 'Most popular', value: 'relevance,desc' },
  { label: 'Lowest price', value: 'vpiScore,asc' },
];

const DATE_PILLS = [
  { label: 'Anytime', value: 'anytime' },
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'This week', value: 'this-week' },
  { label: 'This month', value: 'this-month' },
];

const CATEGORY_OPTIONS = [
  { label: 'Music', value: 'Music' },
  { label: 'Festival', value: 'festival' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Arts & Theatre', value: 'Arts & Theatre' },
  { label: 'Comedy', value: 'Comedy' },
  { label: 'Family', value: 'Family' },
];

/** Reusable sort dropdown — used on both genre and explore-all pages */
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
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white/70 backdrop-blur-sm text-xs font-medium text-gray-700 hover:border-gray-400 transition-all duration-200"
          data-testid="sort-dropdown-trigger"
        >
          {label}
          <ChevronDown size={12} />
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
              sort === option.value
                ? 'bg-gray-100 font-semibold text-black'
                : 'text-gray-700 hover:bg-gray-50'
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

const CategoryDropdown = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentGenre = searchParams.get('genre') ?? '';
  const lat = searchParams.get('lat') ?? '';
  const lng = searchParams.get('lng') ?? '';

  const currentLabel =
    CATEGORY_OPTIONS.find(o => o.value.toLowerCase() === currentGenre.toLowerCase())?.label
    ?? currentGenre
    ?? 'Category';

  const handleSelect = (value: string) => {
    const latParam = lat && lng ? `&lat=${lat}&lng=${lng}` : '';
    navigate(`/events?genre=${encodeURIComponent(value)}${latParam}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white/70 backdrop-blur-sm text-xs font-medium text-gray-700 hover:border-gray-400 transition-all duration-200"
          data-testid="category-dropdown-trigger"
        >
          {currentLabel}
          <ChevronDown size={12} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-white border border-gray-200 rounded-xl shadow-lg min-w-[160px] p-1"
      >
        {CATEGORY_OPTIONS.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${
              option.value.toLowerCase() === currentGenre.toLowerCase()
                ? 'bg-gray-100 font-semibold text-black'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            data-testid={`category-option-${option.value}`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface GenreFiltersBarProps {
  period: string;
  onPeriodChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

/**
 * Compact pill-style filter bar for genre "See all" pages.
 * Shows current location, category switcher, date pills, and a sort dropdown.
 */
export const GenreFiltersBar = ({
  period,
  onPeriodChange,
  sort,
  onSortChange,
}: GenreFiltersBarProps) => {
  const locationLabel =
    typeof window !== 'undefined' ? localStorage.getItem('selectedLocation') : null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3" data-testid="genre-filters-bar">
      {/* Location pill — display only */}
      {locationLabel && (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium">
          <MapPin size={11} />
          {locationLabel}
        </span>
      )}

      {/* Category / genre switcher */}
      <CategoryDropdown />

      {/* Date pills */}
      {DATE_PILLS.map(pill => (
        <button
          key={pill.value}
          onClick={() => onPeriodChange(pill.value)}
          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 ${
            period === pill.value
              ? 'bg-black text-white border-black'
              : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white/70 backdrop-blur-sm'
          }`}
          data-testid={`genre-period-pill-${pill.value}`}
        >
          {pill.label}
        </button>
      ))}

      {/* Sort dropdown — pushed to right */}
      <div className="ml-auto">
        <SortDropdown sort={sort} onSortChange={onSortChange} />
      </div>
    </div>
  );
};

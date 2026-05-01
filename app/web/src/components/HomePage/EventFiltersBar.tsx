import { useState } from 'react';
import { Calendar, Grid, Tag, ChevronDown, LucideIcon, Music2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Types
interface FilterDropdownProps {
  icon: LucideIcon;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  highlighted?: boolean;
}

interface FilterConfig {
  icon: LucideIcon;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  highlighted?: boolean;
}

interface EventFiltersBarProps {
  // Time filter
  time: string;
  onTimeChange: (value: string) => void;
  customDateRange: { from: string; to: string } | null;
  onCustomDateSave: (from: string, to: string) => void;

  // Event type filter
  eventType: string;
  onEventTypeChange: (value: string) => void;

  // Category filter
  category: string;
  onCategoryChange: (value: string) => void;

  // Genre filter
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}

/**
 * FilterDropdown Component
 * Reusable dropdown component using shadcn UI
 */
const FilterDropdown = ({
  icon: Icon,
  value,
  options,
  onChange,
  highlighted = false
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 outline-none whitespace-nowrap ${
            highlighted
              ? 'bg-[#2563EB] text-white border-[#2563EB]'
              : 'border-white/30 bg-white/70 backdrop-blur-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-gray-700 hover:bg-white/90'
          }`}
        >
          <Icon size={16} />
          <span className="font-medium">{value}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-full min-w-[200px] bg-white border border-gray-300 rounded-lg shadow-xl p-0"
        align="start"
        sideOffset={8}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 py-3 cursor-pointer transition-colors ${option === value
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-800 hover:bg-cyan-400/20'
              }`}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * CustomDateModal Component
 * Modal for selecting custom date range
 */
const CustomDateModal = ({
  isOpen,
  onClose,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (from: string, to: string) => void;
}) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleSave = () => {
    if (fromDate && toDate) {
      onSave(fromDate, toDate);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-md w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-left mb-4">Select Custom Date Range</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
            disabled={!fromDate || !toDate}
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save & close
          </button>
          <button
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-500 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * GenreModal Component
 * Modal for multi-selecting music genres
 */
const GenreModal = ({
  selectedGenres,
  onGenresChange
}: {
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedGenres, setTempSelectedGenres] = useState<string[]>(selectedGenres);

  const genres = [
    'Pop', 'Rock', 'Electronic', 'Rap', 'Hip hop',
    'House', 'RnB', 'Indie', 'Techno', 'Latin',
    'Funk', 'Reggae', 'Metal', 'Jazz', 'Punk',
    'Classical', 'Trance', 'Hardcore', 'Hardstyle',
    'Disco', 'Folk', 'Trap', 'Blues',
    'Drum and bass', 'Country', 'EDM', 'Dubstep',
    'Opera', 'Schlager'
  ];

  const toggleGenre = (genre: string) => {
    setTempSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setTempSelectedGenres([]);
  };

  const handleSaveAndClose = () => {
    onGenresChange(tempSelectedGenres);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/30 bg-white/70 backdrop-blur-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-gray-700 text-sm font-medium hover:bg-white/90 transition-all duration-200 outline-none whitespace-nowrap"
        >
          <Music2 size={20} />
          <span className="font-medium">
            {selectedGenres.length > 0 ? `Genre (${selectedGenres.length})` : 'Genre'}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="bg-white max-w-md w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-left mb-4">All genres</DialogTitle>
        </DialogHeader>

        {/* Genre Grid */}
        <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto mb-6 pr-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 ${tempSelectedGenres.includes(genre)
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                : 'border-gray-600 text-gray-600 hover:border-gray-500'
                }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSaveAndClose}
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
          >
            Save & close
          </button>
          <button
            onClick={clearFilters}
            className="text-cyan-400 hover:text-cyan-500 font-medium transition-colors"
          >
            Clear filters
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * EventFiltersBar Component
 * 
 * Main component that renders all event filters:
 * - Time/Date filter with custom date range
 * - Event type filter
 * - Category filter  
 * - Genre multi-select filter
 */
export function EventFiltersBar({
  time,
  onTimeChange,
  customDateRange,
  onCustomDateSave,
  eventType,
  onEventTypeChange,
  category,
  onCategoryChange,
  selectedGenres,
  onGenresChange,
}: EventFiltersBarProps) {
  const [customDateModalOpen, setCustomDateModalOpen] = useState(false);

  const filterOptions = {
    times: ['today', 'tomorrow', 'this-week', 'this-weekend', 'next-week', 'this-month', 'custom'],
    eventTypes: ['All events',],
    categories: ['Category', 'sports', 'theater', "concerts"],
  };

  // Handle time selection
  const handleTimeChange = (value: string) => {
    if (value === 'custom') {
      setCustomDateModalOpen(true);
    } else {
      onTimeChange(value);
    }
  };

  const handleCustomDateSave = (from: string, to: string) => {
    onCustomDateSave(from, to);
    setCustomDateModalOpen(false);
  };

  // Filter Configuration
  const filters: FilterConfig[] = [
    {
      icon: Calendar,
      value: customDateRange ? `${customDateRange.from} - ${customDateRange.to}` : time,
      options: filterOptions.times,
      onChange: handleTimeChange,
    },
    {
      icon: Grid,
      value: eventType,
      options: filterOptions.eventTypes,
      onChange: onEventTypeChange,
    },
    {
      icon: Tag,
      value: category,
      options: filterOptions.categories,
      onChange: onCategoryChange,
    },
  ];

  return (
    <>
      {filters.map((filter, index) => (
        <FilterDropdown
          key={index}
          icon={filter.icon}
          value={filter.value}
          options={filter.options}
          onChange={filter.onChange}
          highlighted={filter.highlighted}
        />
      ))}

      {/* Genre Modal */}
      <GenreModal selectedGenres={selectedGenres} onGenresChange={onGenresChange} />

      {/* Custom Date Modal */}
      <CustomDateModal
        isOpen={customDateModalOpen}
        onClose={() => setCustomDateModalOpen(false)}
        onSave={handleCustomDateSave}
      />
    </>
  );
}

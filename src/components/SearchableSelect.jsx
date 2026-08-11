import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export default function SearchableSelect({
  options = [],
  value = '',
  onChange,
  placeholder = '— เลือก —',
  searchPlaceholder = 'ค้นหา...',
  disabled = false,
  className = '',
  icon: Icon,
  clearable = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Format options into standard { value, label, sublabel } array
  const formattedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        return { value: String(opt), label: String(opt) };
      }
      return {
        value: String(opt.value ?? opt._id ?? opt.id),
        label: String(opt.label ?? opt.name ?? opt.fullName ?? opt.title ?? opt.value ?? ''),
        sublabel: opt.sublabel ?? opt.email ?? opt.departmentName ?? opt.major ?? '',
        original: opt,
      };
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return formattedOptions.find((opt) => opt.value === String(value));
  }, [formattedOptions, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return formattedOptions;
    return formattedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query))
    );
  }, [formattedOptions, search]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optValue, opt) => {
    onChange(optValue, opt);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left rounded-xl border transition-all cursor-pointer ${
          disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : isOpen
            ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
            : 'bg-white border-gray-300 hover:border-gray-400 text-gray-800'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          {Icon && <Icon className="w-4 h-4 text-gray-500 shrink-0" />}
          {selectedOption ? (
            <div className="truncate">
              <span className="text-sm font-medium text-gray-900">{selectedOption.label}</span>
              {selectedOption.sublabel && (
                <span className="ml-2 text-xs text-gray-400">({selectedOption.sublabel})</span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400 truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {clearable && selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
              className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
              title="ล้างตัวเลือก"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </div>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* SEARCH INPUT */}
          <div className="p-2.5 border-b border-gray-100 bg-gray-50/75">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-800 placeholder-gray-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ล้าง
                </button>
              )}
            </div>
          </div>

          {/* OPTIONS LIST */}
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                ไม่พบข้อมูลที่ตรงกับการค้นหา
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value, opt.original)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 text-blue-700 font-semibold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="truncate">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="text-xs text-gray-400 truncate mt-0.5">
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

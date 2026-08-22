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

  const selectedOption = useMemo(() => {
    return formattedOptions.find((opt) => opt.value === String(value));
  }, [formattedOptions, value]);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return formattedOptions;
    return formattedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query))
    );
  }, [formattedOptions, search]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left rounded-xl border transition-all cursor-pointer ${
          disabled
            ? 'bg-surface-accent text-outline border-border-subtle cursor-not-allowed'
            : isOpen
            ? 'bg-surface-main border-primary-container ring-2 ring-primary-fixed shadow-elevation-1'
            : 'bg-surface-main border-border-strong hover:border-outline text-on-background'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          {Icon && <Icon className="w-4 h-4 text-text-secondary shrink-0" />}
          {selectedOption ? (
            <div className="truncate">
              <span className="text-body-emphasized text-on-background">{selectedOption.label}</span>
              {selectedOption.sublabel && (
                <span className="ml-2 text-caption text-text-secondary">({selectedOption.sublabel})</span>
              )}
            </div>
          ) : (
            <span className="text-body-md text-outline truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {clearable && selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
              className="p-1 rounded-full text-outline hover:text-error hover:bg-error-container transition"
              title="ล้างตัวเลือก"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-outline transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary-container' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-surface-main rounded-2xl border border-border-subtle shadow-elevation-hover overflow-hidden">
          <div className="p-2.5 border-b border-border-subtle bg-surface-muted">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-body-md bg-surface-main border border-border-subtle rounded-lg focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-fixed text-on-background placeholder:text-outline"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-caption font-semibold text-on-surface-variant hover:text-on-background bg-surface-accent hover:bg-surface-container-low rounded-md transition cursor-pointer"
                >
                  ล้าง
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-body-md text-outline">
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
                    className={`w-full flex items-center justify-between px-4 py-3 text-left text-body-md transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-insight-tint text-primary font-bold'
                        : 'hover:bg-surface-accent text-on-background'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="truncate font-medium">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="text-caption text-text-secondary truncate mt-0.5">
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary-container shrink-0" />}
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

import { Search as SearchIcon } from "lucide-react";

import { cn } from "../../utils/cn";

const Search = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  ...props
}) => {
  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400"
      />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-secondary-300 bg-white py-2.5 pl-10 pr-4 text-[15px]",
          "placeholder:text-secondary-400",
          "transition-all duration-200",
          "focus:border-primary-600 focus:ring-2 focus:ring-primary-100",
        )}
        {...props}
      />
    </div>
  );
};

export default Search;

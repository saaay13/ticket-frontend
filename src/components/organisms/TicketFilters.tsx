import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { TicketStatus, TicketPriority, TicketCategory } from "@/data/ticketData";

interface TicketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  priorityFilter: string;
  onPriorityChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilters: number;
  onClearFilters: () => void;
  statuses: string[];
  priorities: string[];
  categories: string[];
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  showFilters,
  setShowFilters,
  activeFilters,
  onClearFilters,
  statuses,
  priorities,
  categories,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8A8A88" }} />
          <input
            type="text"
            placeholder="Search by ID, title, or requester..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 transition"
            style={{ "--tw-ring-color": "#07590A" } as React.CSSProperties}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition"
          style={{
            borderColor: activeFilters > 0 ? "#07590A" : "#e5e7eb",
            color: activeFilters > 0 ? "#07590A" : "#8A8A88",
            backgroundColor: activeFilters > 0 ? "#07590A10" : "white",
          }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilters > 0 && (
            <span
              className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
              style={{ backgroundColor: "#07590A" }}
            >
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none"
            style={{ color: statusFilter ? "#07590A" : "#8A8A88" }}
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none"
            style={{ color: priorityFilter ? "#07590A" : "#8A8A88" }}
          >
            <option value="">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none"
            style={{ color: categoryFilter ? "#07590A" : "#8A8A88" }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {activeFilters > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition"
              style={{ color: "#EF4444", backgroundColor: "#FEF2F2" }}
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

import React from "react";

interface TicketPaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  filteredCount: number;
  perPage: number;
}

export const TicketPagination: React.FC<TicketPaginationProps> = ({
  page,
  totalPages,
  setPage,
  filteredCount,
  perPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white rounded-b-xl border-x border-b">
      <span className="text-xs" style={{ color: "#8A8A88" }}>
        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredCount)} of {filteredCount}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className="w-7 h-7 rounded-md text-xs transition"
            style={{
              backgroundColor: p === page ? "#07590A" : "transparent",
              color: p === page ? "white" : "#8A8A88",
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

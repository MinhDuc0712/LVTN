import React from "react";

const SearchBar = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="hidden md:flex">
            <input
              type="text"
              placeholder="Tìm theo khu vực"
              className="bg-gray-100 px-4 py-2 rounded-full text-sm w-60"
              aria-label="Search by area"
            />
            <button
              className="border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-gray-100 ml-2"
              aria-label="Open filter options"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-1 w-5 h-5 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
              Bộ lọc
            </button>
          </div>
    </div>
  );
};

export default SearchBar;

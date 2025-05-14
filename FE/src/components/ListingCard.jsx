import React from "react";

const ListingCard = ({ listings }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Image Section */}
          <div className="relative h-48 w-full">
            <img
              src={
                listing.image ||
                `/api/placeholder/400/320`
              }
              alt={listing.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = `/api/placeholder/400/320`;
              }}
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                {listing.type}
              </span>
              {listing.price < 3 && (
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Giá rẻ
                </span>
              )}
            </div>
            <div className="absolute right-3 bottom-3 rounded-full bg-white px-3 py-1 text-sm font-bold text-orange-500 shadow-md">
              {listing.price} triệu/tháng
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5">
            <h3 className="mb-2 line-clamp-2 cursor-pointer text-lg font-bold transition-colors hover:text-blue-600">
              {listing.title}
            </h3>

            <div className="mb-3 flex items-center text-gray-500">
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                {listing.district}, {listing.city}
              </span>
            </div>

            <div className="mb-4 flex justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                <span>{listing.area} m²</span>
              </div>
              <div className="flex items-center text-gray-500">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{listing.postedTime}</span>
              </div>
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {listing.description}
            </p>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center">
                <svg
                  className="mr-1 h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="font-medium text-gray-700">
                  {listing.contact}
                </span>
              </div>
              <button className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-200">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingCard;

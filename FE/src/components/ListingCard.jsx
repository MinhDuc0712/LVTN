import React from "react";
import { Heart, MapPin, Calendar, Square, Phone, Eye } from "lucide-react";
import { Link } from 'react-router-dom'; 

const formatnumber = (num) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};
const ListingCard = ({ listings }) => {
  return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="min-h-48 w-full sm:w-1/3">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Header with remove button */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
                        {listing.type}
                      </span>
                      {listing.price < 3 && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                          Giá rẻ
                        </span>
                      )}
                    </div>
                    <button
                      // onClick={() => handleRemoveFromSaved(listing.id)}
                      className="p-1 text-gray-300 hover:text-red-600"
                      title="ưu"
                    >
                      <Heart className="h-5 w-5 fill-current bg-white" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 line-clamp-2 cursor-pointer text-lg font-bold text-gray-800 hover:text-amber-600">
                    {listing.title}
                  </h3>

                  {/* Price */}
                  <div className="mb-3 text-2xl font-bold text-amber-600">
                    {formatnumber(listing.price)} triệu/tháng
                  </div>

                  {/* Details */}
                  <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      <span>{listing.area} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.district}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <p className="mb-3 text-sm text-gray-600">
                    <MapPin className="mr-1 inline h-4 w-4" />
                    {listing.address}
                  </p>

                  {/* Description */}
                  <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-700">
                    {listing.description}
                  </p>

                  {/* Footer */}
                  <div className="flex-wrap items-center justify-between border-t border-gray-100 pt-4 sm:flex md:flex">
                    <div className="flex md:flex-col items-center justify-between gap-2 text-xs text-gray-500 border-b border-gray-100 pb-2 sm:border-b-0 sm:pb-0 md:border-b-0 md:pb-0">
                      {/* <div className="mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Lưu: {listing.savedTime}</span>
                      </div> */}
                      <div className="mb-1 flex items-center gap-1">
                        Thời gian đăng: {listing.postedTime}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 md:flex-row">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{listing.contact}</span>
                      </div>
                      <Link to={`/room/${listing.id}`} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600">
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
  );
};

export default ListingCard;

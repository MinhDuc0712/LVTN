import React, { useEffect, useState } from "react";

const FilterSection = ({ onApplyFilters, isLoading }) => {
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [isProvinceLoading, setIsProvinceLoading] = useState(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setIsProvinceLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const handleApply = () => {
    if (isLoading) return; // Ngăn chặn click khi đang loading
    
    // Chuẩn bị params lọc
    const filters = {};
    
    if (selectedPrice) filters.price = selectedPrice;
    if (selectedArea) filters.area = selectedArea;
    if (selectedProvince) filters.province = selectedProvince;
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setSelectedPrice(null);
    setSelectedArea(null);
    setSelectedProvince("");
    onApplyFilters({});
  };

  const priceRanges = [
    { label: "Dưới 1 triệu", value: "under-1m" },
    { label: "1-2 triệu", value: "1-2m" },
    { label: "2-3 triệu", value: "2-3m" },
    { label: "3-5 triệu", value: "3-5m" },
    { label: "5-7 triệu", value: "5-7m" },
    { label: "7-10 triệu", value: "7-10m" },
    { label: "10-15 triệu", value: "10-15m" },
    { label: "Trên 15 triệu", value: "over-15m" },
  ];

  const areas = [
    { label: "Dưới 20m²", value: "under-20" },
    { label: "20-30m²", value: "20-30" },
    { label: "30-50m²", value: "30-50" },
    { label: "50-70m²", value: "50-70" },
    { label: "70-90m²", value: "70-90" },
    { label: "Trên 90m²", value: "over-90" },
  ];

  return (
    <div className="sticky top-4 rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">
        Bộ lọc tìm kiếm
      </h2>

      {/* Price Filter */}
      <div className="mb-8">
        <h3 className="mb-4 font-semibold text-gray-700">
          Khoảng giá (triệu/tháng)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedPrice(range.value)}
              disabled={isLoading}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                selectedPrice === range.value
                  ? "bg-[#ff5723] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Area Filter */}
      <div className="mb-8">
        <h3 className="mb-4 font-semibold text-gray-700">Diện tích (m²)</h3>
        <div className="grid grid-cols-2 gap-3">
          {areas.map((area) => (
            <button
              key={area.value}
              onClick={() => setSelectedArea(area.value)}
              disabled={isLoading}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                selectedArea === area.value
                  ? "bg-[#ff5723] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>

      {/* Province Filter */}
      <div className="mb-8">
        <h3 className="mb-4 font-semibold text-gray-700">Tỉnh/Thành phố</h3>
        {isProvinceLoading ? (
          <div className="animate-pulse rounded-lg bg-gray-200 p-3">
            Đang tải danh sách tỉnh/thành...
          </div>
        ) : (
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            disabled={isLoading}
            className={`w-full rounded-lg border border-gray-300 p-3 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="">-- Chọn Tỉnh/TP --</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Reset & Apply Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          disabled={isLoading}
          className={`flex-1 rounded-lg border border-gray-300 py-2 transition-colors hover:bg-gray-100 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Đặt lại
        </button>
        <button
          onClick={handleApply}
          disabled={isLoading || isProvinceLoading}
          className={`flex-1 rounded-lg bg-[#ff5723] py-2 text-white transition-colors hover:bg-orange-600 ${
            isLoading || isProvinceLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Đang lọc..." : "Áp dụng"}
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
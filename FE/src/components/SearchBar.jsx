import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = ({ onApplyFilters, isLoading }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [currentLevel, setCurrentLevel] = useState("province");
  const [currentProvince, setCurrentProvince] = useState(null);
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch provinces
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách tỉnh/thành");
        return res.json();
      })
      .then(setProvinces)
      .catch((err) => setError(err.message));
  }, []);

  // Fetch districts
  const fetchDistricts = async (provinceCode) => {
    try {
      const res = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`,
      );
      if (!res.ok) throw new Error("Không thể tải danh sách quận/huyện");
      const data = await res.json();
      setDistricts(data.districts || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch wards
  const fetchWards = async (districtCode) => {
    try {
      const res = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`,
      );
      if (!res.ok) throw new Error("Không thể tải danh sách phường/xã");
      const data = await res.json();
      setWards(data.wards || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle province selection/navigation
  const handleProvinceClick = (province) => {
    setCurrentProvince(province);
    setCurrentLevel("district");
    if (province.code !== "00") {
      fetchDistricts(province.code);
    } else {
      setDistricts([]); // Reset districts for "Toàn quốc"
    }
    setSelectedLocation({
      type: "province",
      code: province.code,
      name: province.name,
      displayText: province.name,
    });
  };

  // Handle district selection/navigation
  const handleDistrictClick = (district) => {
    setCurrentDistrict(district);
    setCurrentLevel("ward");
    fetchWards(district.code);
    setSelectedLocation({
      type: "district",
      provinceCode: currentProvince.code,
      provinceName: currentProvince.name,
      code: district.code,
      name: district.name,
      displayText: `${district.name}, ${currentProvince.name}`,
    });
  };

  // Handle ward selection
  const handleWardClick = (ward) => {
    setSelectedLocation({
      type: "ward",
      provinceCode: currentProvince.code,
      provinceName: currentProvince.name,
      districtCode: currentDistrict.code,
      districtName: currentDistrict.name,
      code: ward.code,
      name: ward.name,
      displayText: `${ward.name}, ${currentDistrict.name}, ${currentProvince.name}`,
    });
  };

  // Handle "Toàn quốc" selection
  const handleSelectAll = () => {
    setSelectedLocation({
      type: "all",
      code: "00",
      name: "",
      displayText: "Toàn quốc",
    });
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentLevel === "district") {
      setCurrentLevel("province");
      setCurrentProvince(null);
      setDistricts([]);
      setCurrentDistrict(null);
      setWards([]);
    } else if (currentLevel === "ward") {
      setCurrentLevel("district");
      setCurrentDistrict(null);
      setWards([]);
    }
  };

  // Handle apply filters
  // const handleApply = () => {
  //   const filters = {};
  //   if (selectedLocation) {
  //     filters.location = selectedLocation;
  //   }
  //   console.log("Applied filters:", filters);
  //   onApplyFilters(filters);
  //   setShowLocationPopup(false);
  // };
  const handleApply = () => {
    const filters = {};
    if (currentProvince) {
      filters.province = currentProvince.name;
      if (currentProvince.code !== "00" && currentDistrict) {
        filters.district = currentDistrict.name;
        if (selectedLocation?.type === "ward") {
          filters.ward = selectedLocation.name;
        }
      }
    }
    console.log("Applied filters:", filters);
    onApplyFilters(filters);
    setShowLocationPopup(false);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  // Get display text for button
  const getButtonText = () => {
    return selectedLocation ? selectedLocation.displayText : "Tìm theo khu vực";
  };

  // Check if current item is selected
  const isSelected = (type, code) => {
    if (!selectedLocation) return false;
    switch (type) {
      case "province":
        return (
          selectedLocation.type === "province" && selectedLocation.code === code
        );
      case "district":
        return (
          selectedLocation.type === "district" && selectedLocation.code === code
        );
      case "ward":
        return (
          selectedLocation.type === "ward" && selectedLocation.code === code
        );
      case "all":
        return (
          selectedLocation.type === "all" && selectedLocation.code === "00"
        );
      default:
        return false;
    }
  };

  // Get current title based on level
  const getCurrentTitle = () => {
    switch (currentLevel) {
      case "province":
        return "Tìm theo khu vực";
      case "district":
        return `Chọn Quận/Huyện - ${currentProvince?.name || ""}`;
      case "ward":
        return `Chọn Phường/Xã - ${currentDistrict?.name || ""}`;
      default:
        return "Tìm theo khu vực";
    }
  };

  // Reset selections when opening popup
  const handleOpenPopup = () => {
    setShowLocationPopup(true);
    setCurrentLevel("province");
    setCurrentProvince(null);
    setCurrentDistrict(null);
    setDistricts([]);
    setWards([]);
    setSelectedLocation(null); // Reset selected location when reopening
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <button
          onClick={handleOpenPopup}
          className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
        >
          <svg
            className="h-4 w-4 text-gray-500"
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
          <span>{getButtonText()}</span>
        </button>

        <button
          onClick={handleApply}
          disabled={isLoading || !selectedLocation}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
            />
          </svg>
          <span>{isLoading ? "Đang lọc..." : "Bộ lọc"}</span>
        </button>
      </div>

      {/* Modal Popup */}
      {showLocationPopup && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-[#000] opacity-50"
            onClick={() => setShowLocationPopup(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                {currentLevel !== "province" && (
                  <button
                    onClick={handleBack}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {getCurrentTitle()}
                </h3>
              </div>
              <button
                onClick={() => setShowLocationPopup(false)}
                className="flex h-8 w-8 items-center justify-center text-xl font-bold text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto p-4">
              {error && (
                <div className="mb-4 rounded bg-red-50 p-2 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {/* Province Level */}
                {currentLevel === "province" && (
                  <>
                    {/* Toàn quốc option */}
                    <div
                      className={`flex cursor-pointer items-center rounded p-2 hover:bg-gray-50 ${
                        isSelected("all", "00") ? "bg-orange-50" : ""
                      }`}
                      onClick={handleSelectAll}
                    >
                      <span
                        className={`mr-3 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300 ${
                          isSelected("all", "00")
                            ? "border-orange-500 bg-orange-500"
                            : "bg-white"
                        }`}
                      />
                      <span className="flex-1 text-sm font-medium text-gray-900">
                        Toàn quốc
                      </span>
                      <button
                        onClick={() =>
                          handleProvinceClick(
                            { code: "00", name: "Toàn quốc" },
                            true,
                          )
                        }
                        className="rounded p-1 hover:bg-gray-200"
                      >
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Provinces list */}
                    {provinces.map((province) => (
                      <div
                        key={province.code}
                        className={`flex cursor-pointer items-center rounded p-2 hover:bg-gray-50 ${
                          isSelected("province", province.code)
                            ? "bg-orange-50"
                            : ""
                        }`}
                        onClick={() => handleProvinceClick(province)}
                      >
                        <span
                          className={`mr-3 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300 ${
                            isSelected("province", province.code)
                              ? "border-orange-500 bg-orange-500"
                              : "bg-white"
                          }`}
                        />
                        <span className="ml-3 flex-1 text-sm text-gray-900">
                          {province.name}
                        </span>
                        <button
                          onClick={() => handleProvinceClick(province, true)}
                          className="rounded p-1 hover:bg-gray-200"
                        >
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {/* District Level */}
                {currentLevel === "district" &&
                  currentProvince &&
                  currentProvince.code !== "00" && (
                    <>
                      {districts.map((district) => (
                        <div
                          key={district.code}
                          className={`flex cursor-pointer items-center rounded p-2 hover:bg-gray-50 ${
                            isSelected("district", district.code)
                              ? "bg-orange-50"
                              : ""
                          }`}
                          onClick={() => handleDistrictClick(district)}
                        >
                          <span
                            className={`mr-3 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300 ${
                              isSelected("district", district.code)
                                ? "border-orange-500 bg-orange-500"
                                : "bg-white"
                            }`}
                          />
                          <span className="ml-3 flex-1 text-sm text-gray-900">
                            {district.name}
                          </span>
                          <button
                            onClick={() => handleDistrictClick(district, true)}
                            className="rounded p-1 hover:bg-gray-200"
                          >
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </>
                  )}

                {/* Ward Level */}
                {currentLevel === "ward" && currentDistrict && (
                  <>
                    {wards.map((ward) => (
                      <div
                        key={ward.code}
                        className={`flex cursor-pointer items-center rounded p-2 hover:bg-gray-50 ${
                          isSelected("ward", ward.code) ? "bg-orange-50" : ""
                        }`}
                        onClick={() => handleWardClick(ward)}
                      >
                        <span
                          className={`mr-3 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300 ${
                            isSelected("ward", ward.code)
                              ? "border-orange-500 bg-orange-500"
                              : "bg-white"
                          }`}
                        />
                        <span className="ml-3 flex-1 text-sm text-gray-900">
                          {ward.name}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t bg-gray-50 p-4">
              <button
                onClick={() => setShowLocationPopup(false)}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleApply}
                disabled={!selectedLocation}
                className="rounded bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;

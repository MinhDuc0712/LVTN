import { axiosUser, axiosAdmin, axiosAuth } from "../axios";

// Lấy danh mục cho user
export const getCategoriesAPI = async () => {
  const response = await axiosUser.get("/categories");
  return response;
};

// Thêm danh mục từ admin
export const postCategoryAPI = async (data) => {
  const response = await axiosAdmin.post("/categories", data);
  return response;
};
// Cập nhật danh mục
export const updateCategoryAPI = async (id, data) => {
  return await axiosAdmin.put(`/categories/${id}`, data);
};
// Xóa danh mục
export const deleteCategoryAPI = async (id) => {
  return await axiosAdmin.delete(`/categories/${id}`);
};

// Lấy danh sách tiện ích
export const getUtilitiesAPI = async () => {
  const response = await axiosUser.get("/utilities");
  return response;
};

// Thêm tiện ích
export const postUtilitiesAPI = async (data) => {
  const response = await axiosAdmin.post("/utilities", data);
  return response;
};
// Cập nhật tiện ích
export const updateUtilitiesAPI = async (id, data) => {
  return await axiosAdmin.put(`/utilities/${id}`, data);
};
// Xóa tiện ích
export const deleteUtilitiesAPI = async (id) => {
  return await axiosAdmin.delete(`/utilities/${id}`);
};
export const getUserDepositsAPI = async (params = {}) => {
  const response = await axiosUser.get("/deposits", {
    params: {
      page: params.page,
      per_page: params.limit,
      ma_nguoi_dung: params.ma_nguoi_dung,
    },
  });
  return response.data;
};

export const updateUserDepositAPI = async (id, data) => {
  const response = await axiosUser.put(`/deposits/${id}`, data);
  return response.data;
};

export const deleteUserDepositAPI = async (id) => {
  const response = await axiosUser.delete(`/deposits/${id}`);
  return response.data;
};

export const postUserDepositAPI = async (data) => {
  const response = await axiosUser.post("/deposits", data);
  return response;
};

// Lấy danh sách giao dịch nạp tiền
export const getDepositTransactionsAPI = async (params = {}) => {
  try {
    const response = await axiosAdmin.get("/deposits", {
      params: {
        page: params.page,
        per_page: params.limit,
        ma_nguoi_dung: params.ma_nguoi_dung,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Thêm giao dịch nạp tiền
export const postDepositTransactionAPI = async (data) => {
  const response = await axiosAdmin.post("/deposits", data);
  return response;
};
// Cập nhật giao dịch nạp tiền
export const updateDepositTransactionAPI = async (id, data) => {
  const response = await axiosAdmin.put(`/deposits/${id}`, data);
  return response.data;
};
// Xóa giao dịch nạp tiền
export const deleteDepositTransactionAPI = async (id) => {
  const response = await axiosAdmin.delete(`/deposits/${id}`);
  return response.data;
};
// Lấy danh sách người dùng
export const getUserByIdentifierAPI = async (identifier) => {
  try {
    const response = await axiosAdmin.get(`/users/${identifier}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
// Tìm kiếm người dùng theo mã hoặc email
export const findUserAPI = async (identifier) => {
  try {
    const response = await axiosAdmin.get(`/users/${identifier}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        success: false,
        message: "Không tìm thấy người dùng",
      };
    }
    throw error;
  }
};
// Cập nhật thông tin người dùng
export const updateUserBalanceAPI = async (userId, amount) => {
  return await axiosAdmin.patch(`/user/${userId}`, { amount });
};

// API cho đăng nhập
export const postLoginAPI = async (data) => {
  const response = await axiosAuth.post("/login", data);
  return response;
};
// API cho đăng ký
export const postRegisterAPI = async (data) => {
  const response = await axiosAuth.post("/register", data);
  return response;
};
// API cho đăng xuất
export const postLogoutAPI = async () => {
  const response = await axiosAuth.post("/logout");
  return response;
};
// API lấy thông tin người dùng hiện tại
export const getUserProfileAPI = async () => {
  try {
    const data = await axiosAuth.get("/profile");
    if (data.user) {
      return {
        success: true,
        user: data.user,
        roles: data.roles,
      };
    } else {
      return {
        success: false,
        message: "Không có dữ liệu người dùng trả về",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message ?? error?.message ?? "Lỗi kết nối API",
    };
  }
};

// Cập nhật thông tin người dùng
export const updateUserProfileAPI = async (data) => {
  try {
    const response = await axiosAuth.post("/updateProfile", data);
    console.log("RESPONSE", response);
    return {
      success: true,
      message: response.message || "Cập nhật thông tin thành công",
      user: response.user || {},
      roles: response.roles || [],
    };
  } catch (error) {
    console.error("Lỗi cập nhật thông tin người dùng:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Cập nhật thông tin thất bại";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Gửi yêu cầu đổi mật khẩu tới backend
export const changePasswordAPI = async (data) => {
  try {
    const response = await axiosAuth.post("changePassword", data);
    return {
      success: true,
      message: response.message || "Đổi mật khẩu thành công",
    };
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Đổi mật khẩu thất bại",
    };
  }
};

// API thêm house
export const postHouseAPI = async (data) => {
  const response = await axiosUser.post("/houses", data);
  return response.data;
};

export const getHouses = async () => {
  const response = await axiosUser.get("/houses");
  return response;
  // try {
  //   const response = await axiosUser.get("/houses");
  //   return response.data || response;
  // } catch (error) {
  //   console.error(
  //     "Error fetching public houses:",
  //     error.response?.data || error.message,
  //   );
  //   throw error;
  // }
};

export const getFeaturedHouses = async () => {
  try {
    const response = await axiosUser.get("/houses/featured");
    return response.data || response;
  } catch (error) {
    console.error(
      "Error fetching featured houses:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getHousesById = async (Id) => {
  const res = await axiosUser.get(`/houses/${Id}`);
  return res.data;
};
const fetchHousesByCategory = async (categoryId) => {
  const res = await axiosUser.get(`/houses/category/${categoryId}`);
  return res.data.data;
};

export function useHousesByCategory(categoryId) {
  return useQuery(
    ["housesByCategory", categoryId],
    () => fetchHousesByCategory(categoryId),
    {
      enabled: !!categoryId,
    },
  );
}
export const getHousesByCategory = (categoryId) => {
  return axiosUser.get(`/houses/category/${categoryId}`);
};

// API lấy danh sách nhà
export const getRatingsByHouseAPI = async (maNha) => {
  const response = await axiosUser.get(`/ratings`, {
    params: { MaNha: maNha },
  });
  return response;
};

// API thêm đánh giá
export const postRatingAPI = async (data) => {
  const response = await axiosUser.post(`/ratings`, data);
  return response;
};

export const toggleRatingLikeAPI = async (ratingId, action) => {
  const res = await axiosUser.put(`/ratings/${ratingId}`, {
    action,
  });
  return res.data;
};

export const deleteRatingAPI = async (id) => {
  return axiosUser.delete(`/ratings/${id}`);
};

export const getHousesWithFilter = async (params) => {
  return axiosUser.get("/houses", { params }); // axios tự parse JSON
};
export const postPaymentForHouse = async (payload) => {
  const response = await axiosUser.post("/payments", payload);
  return response;
};

export const getUserHouses = async () => {
  const res = await axiosUser.get("/houses/user-posts");
  return res.data;
};
export const fetchUserPayments = async () => {
  // try {
    const response = await axiosUser.get("/payments");
    return response;
    // console.log("fetchUserPayments response:", response);
  //   const data = Array.isArray(response) ? response : response.data;
  //   return data ?? [];
  // } catch (error) {
  //   return [];
  // }
};
// kỉm duyet bai dang admin
export const getAllHousesForAdmin = async (params = {}) => {
  const response = await axiosAdmin.get("/houses", { params });
  return response;
};

export const approveHouse = async (houseId) => {
  const response = await axiosAdmin.put(`/houses/${houseId}/approve`);
  return response;
};

export const rejectHouse = (id, reason) => {
  return axiosAdmin.post(`/houses/${id}/reject`, { reason });
};
//Edit post
// export const getPostById = async (id) => {
//   const res = await axiosUser.get(`/houses/${id}`);
//   return res.data;
// };

// Thêm yêu thích (nếu chưa tồn tại, backend sẽ tạo)
export const addFavoriteAPI = async (houseId) => {
  if (!sessionStorage.getItem("user")) return false;
  // const response = await axiosUser.post(`/favorite/${houseId}`);
  // return response.data;

  const response = await axiosUser.post(`/favorites`, { MaNha: houseId });
  // console.log("Add favorite response:", response.data);
  return response.data;
};

// Truyền vào MaYeuThich, không phải MaNha
export const toggleFavoriteAPI = async (favoriteId, action = "like") => {
  const response = await axiosUser.put(`/favorites/${favoriteId}`, { action });
  return response;
};

// Xóa khỏi danh sách yêu thích
export const deleteFavoriteAPI = async (favoriteId) => {
  const response = await axiosUser.delete(`/favorites/${favoriteId}`);
  return response.data;
};

// Lấy danh sách nhà yêu thích
export const getFavoritesAPI = async () => {
  if (!sessionStorage.getItem("user")) return false;
  const response = await axiosUser.get("/favorites");
  return response.data;
};

// AN Tin
export const hideHouse = (id) => {
  return axiosUser.put(`/houses/${id}/hide`);
};
// Đăng lại
export const relistHouse = async (id) => {
  const res = await axiosUser.put(`/houses/${id}/relist`);
  return res; 
};

export const createZaloPayPayment = async (payload) => {
  try {
    const res = await axiosUser.post("/zalopay/create-payment", payload);
    return res;
  } catch (error) {
    console.error("Error creating ZaloPay payment:", error);
    throw error;
  }
};

export const checkStatus = async (maGiaoDich) => {
  const res = await axiosUser.get(`/zalopay/check-transaction/${maGiaoDich}`);
  // console.log("Check status response:", res);
  return res;
}

export const fetchDashboardStats = async () => {
  const res = await axiosAdmin.get("/dashboard-stats");
  return res;
};

export const fetchChartData = async () => {
  const res = await axiosAdmin.get("/dashboard-charts");
  // console.log("Chart data:", res);
  return res;
};

export const SendOTPAPI = async (email) => {
    const response = await axiosAuth.post("/send-otp", { Email: email });
    return response;
}

export const VerifyOTPAPI = async (email, otp) => {
  const response = await axiosAuth.post("/verify-otp", { Email: email, otp });
  return response;
};

export const ResetPasswordAPI = async (email, resetToken, newPassword) => {
  const response = await axiosAuth.post("/reset-password", {
    Email: email,
    reset_token: resetToken,
    new_password: newPassword,
  });
  return response;
};
// PHONG ADMIN 
export const addRoomAPI = async (formData) => {
  const response = await axiosAdmin.post("/rooms", formData);
  return response;
};

export const uploadRoomImagesAPI = (roomId, { urls }) =>
  axiosAdmin.post(`/rooms/${roomId}/images`, { urls });


export const getRoomsAPI = async () => {
  const response = await axiosAdmin.get("/rooms");
  return response.data;
};
export const deleteRoomAPI = (id) => axiosAdmin.delete(`/rooms/${id}`);

export const getRoomByIdAPI = (id) => axiosAdmin.get(`/rooms/${id}`);
export const updateRoomAPI = (id, formData) =>
  axiosAdmin.post(`/rooms/${id}`, formData);
export const deleteRoomImageAPI = (imageId) =>
  axiosAdmin.delete(`/room-images/${imageId}`);
export const getRoomImagesAPI = (roomId) =>
  axiosAdmin.get(`/rooms/${roomId}/images`);

export const getRoomUserAPI = async (data) => {
  const response = await axiosUser.get(`/rooms`, data);
  return response.data;
}
export const getRoomUserByIdAPI = async (id) => {
  const response = await axiosUser.get(`/rooms/${id}`);
  return response;
}

export const createKhach = async (data) => {
  const response = await axiosUser.post("/khach", data);
  return response;
}

export const createHopDong = async (data) => {
  const response = await axiosUser.post("/hopdong", data);
  return response;
}

export const getHopDong = async () => {
  const response = await axiosAdmin.get("/hopdong");
  return response;
}
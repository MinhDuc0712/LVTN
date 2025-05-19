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

export const deleteCategoryAPI = async (id) => {
  return await axiosAdmin.delete(`/categories/${id}`);
};

export const postLoginAPI = async (data) => {
  const response = await axiosAuth.post("/login", data);
  return response;
}

export const postRegisterAPI = async (data) => {
  const response = await axiosAuth.post("/register", data);
  return response;
};

export const postLogoutAPI = async () => {
  const response = await axiosAuth.post("/logout");
  return response;
}
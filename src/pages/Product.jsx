import axios from "axios";

const API = axios.create({
  baseURL: "https://api-node-seclob.onrender.com",
});

export const addProductApi = async (formData) => {
  const response = await API.post("/api/product/add-product", formData);

  return response.data;
};

export const addCategoryApi = async (data) => {
  const response = await API.post("/api/user/category", data);

  return response.data;
};
export const getCategoriesApi = async () => {
  const response = await API.get("/api/user/category");

  return response.data;
};
export const addSubCategoryApi = async (data) => {
  const response = await API.post("/api/user/subcategory", data);

  return response.data;
};
export const getSubCategoriesApi = async () => {
  const response = await API.get(
    "/api/user/subcategorys",
  );
  return response.data;
};
export const getProductsApi = async (page = 1, limit = 10) => {
  const response = await API.get(
    `/api/product/productss?page=${page}&limit=${limit}`,
  );

  return response.data;
};
export const searchProductsApi = async (keyword) => {
  const response = await API.get(`/api/product/search?keyword=${keyword}`);

  return response.data;
};
export const getProductByIdApi = async (id) => {
  const response = await API.get(`/api/product/product/${id}`);

  return response.data;
};
export const addToWishlistApi = async (userId, productId) => {
  const response = await API.post("/api/wishlist/add", {
    userId,
    productId,
  });

  return response.data;
};
export const getWishlistApi = async (userId) => {
  const response = await API.get(`/api/wishlist/${userId}`);

  return response.data;
};
export const removeFromWishlistApi = async (userId, productId) => {
  const response = await API.delete("/api/wishlist/remove", {
    data: {
      userId,
      productId,
    },
  });

  return response.data;
};

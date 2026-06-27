import api from "@/lib/axios";

export const productService = {
  getVendorProducts: async () => {
    const res = await api.get("/products/vendor/my-products");
    return res.data;
  },

  getManageProduct: async (id) => {
    const res = await api.get(`/products/manage/${id}`);
    return res.data;
  },

  createProduct: async (payload) => {
    const res = await api.post("/products", payload);
    return res.data;
  },

  updateProduct: async (id, payload) => {
    const res = await api.patch(`/products/${id}`, payload);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  uploadImages: async (id, files, isMain = false) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("isMain", isMain ? "true" : "false");

    const res = await api.post(`/products/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  addVariants: async (id, variants) => {
    const res = await api.post(`/products/${id}/variants`, { variants });
    return res.data;
  },

  replaceVariants: async (id, variants) => {
    const res = await api.put(`/products/${id}/variants`, { variants });
    return res.data;
  },

deleteImage: async (imageId) => {
  const res = await api.delete(`/products/images/${imageId}`);
  return res.data;
},

  getCategories: async () => {
    const res = await api.get("/categories");
    return res.data;
  },

  getBrands: async () => {
    const res = await api.get("/brands");
    return res.data;
  },
};

import "../../styles/ModalManager.css";
import {
  addProductApi,
  addCategoryApi,
  getCategoriesApi,
  addSubCategoryApi,
  getSubCategoriesApi,
} from "../../pages/Product";
import { useEffect, useState } from "react";

export default function ModalManager({ type, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    variants: [
      {
        ram: "",
        price: "",
        quantity: 1,
      },
    ],
    subCategory: "",
    description: "",
    images: [],
    category: "",
    subCategoryName: "",
  });

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...formData.variants];

    updated[index][field] = value;

    setFormData({
      ...formData,
      variants: updated,
    });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          ram: "",
          price: "",
          quantity: 1,
        },
      ],
    });
  };

  const handleImageUpload = (e) => {
    setFormData({
      ...formData,
      images: Array.from(e.target.files),
    });
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);

      data.append("subCategory", formData.subCategory);

      data.append("category", formData.category);

      data.append("variants", JSON.stringify(formData.variants));

      formData.images.forEach((image) => {
        data.append("images", image);
      });
      
      const response = await addProductApi(data);
      console.log(data);
      alert(response.message);

      console.log(response);

      onClose();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);

      const response = await addCategoryApi({
        name: formData.category,
      });

      alert(response.message);

      setFormData({
        ...formData,
        category: "",
      });

      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      setCategories(response.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchSubCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const handleAddSubCategory = async () => {
    try {
      setLoading(true);

      const response = await addSubCategoryApi({
        name: formData.subCategoryName,
        categoryId: formData.category,
      });

      alert(response.message);

      setFormData({
        ...formData,
        category: "",
        subCategoryName: "",
      });

      onClose();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to add sub category");
    } finally {
      setLoading(false);
    }
  };
  const fetchSubCategories = async () => {
    try {
      const response = await getSubCategoriesApi();

      setSubCategories(response.subCategories);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   if (isOpen) {
  //     fetchCategories();
  //     fetchSubCategories();
  //   }
  // }, [isOpen]);
  // if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="product-modal">
        {type === "product" && (
          <>
            <h2>Add Product</h2>

            <div className="form-row">
              <label>Title :</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInput}
                placeholder="Product Title"
              />
            </div>

            <div className="form-row">
              <label>Category :</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInput}
                placeholder="Category"
              />
            </div>

            <div className="form-row">
              <label>Variants :</label>

              <div className="variant-wrapper">
                {formData.variants.map((variant, index) => (
                  <div className="variant-row" key={index}>
                    <input
                      placeholder="RAM"
                      value={variant.ram}
                      onChange={(e) =>
                        handleVariantChange(index, "ram", e.target.value)
                      }
                    />

                    <input
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(index, "price", e.target.value)
                      }
                    />

                    <input
                      type="number"
                      placeholder="Quantity"
                      value={variant.quantity}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                ))}

                <button
                  type="button"
                  className="variant-btn"
                  onClick={addVariant}
                >
                  Add Variant
                </button>
              </div>
            </div>
            <div className="form-row">
              <label>Sub Category :</label>

              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInput}
              >
                <option value="">Select Sub Category</option>

                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Description :</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInput}
                rows="4"
              />
            </div>

            <div className="form-row">
              <label>Images :</label>

              <input type="file" multiple onChange={handleImageUpload} />
            </div>

            <div className="modal-actions">
              <button
                className="add-btn"
                onClick={handleAddProduct}
                disabled={loading}
              >
                {loading ? "Adding..." : "ADD"}
              </button>

              <button className="discard-btn" onClick={onClose}>
                DISCARD
              </button>
            </div>
          </>
        )}

        {type === "subcategory" && (
          <>
            <h2>Add Sub Category</h2>

            <div className="subcategory-form">
              <select
                name="category"
                value={formData.category}
                onChange={handleInput}
                className="subcategory-input"
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="subCategoryName"
                value={formData.subCategoryName}
                onChange={handleInput}
                placeholder="Enter sub category name"
                className="subcategory-input"
              />

              {/* <div className="subcategory-image-upload">
              <label>Upload Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              /> */}

              {/* {formData.images.length > 0 && (
                <div className="subcategory-preview">
                  <img
                    src={URL.createObjectURL(
                      formData.images[0]
                    )}
                    alt="preview"
                  />
                </div>
              )} */}
              {/* </div> */}

              <div className="subcategory-actions">
                <button
                  className="add-btn"
                  onClick={handleAddSubCategory}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "ADD"}
                </button>
                <button className="discard-btn" onClick={onClose}>
                  DISCARD
                </button>
              </div>
            </div>
          </>
        )}

        {type === "category" && (
          <>
            <h2>Add Category</h2>

            <div className="subcategory-form">
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInput}
                placeholder="Enter category name"
                className="subcategory-input"
              />

              <div className="subcategory-actions">
                <button
                  className="add-btn"
                  onClick={handleAddCategory}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "ADD"}
                </button>

                <button className="discard-btn" onClick={onClose}>
                  DISCARD
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

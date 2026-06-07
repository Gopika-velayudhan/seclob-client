import React, { useEffect, useState } from "react";
import "../../styles/Sidebar.css";
import {
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

import {
  getCategoriesApi,
  getSubCategoriesApi,
} from "../../pages/Product";

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [expandedCategory, setExpandedCategory] =
    useState(null);

  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response =
        await getCategoriesApi();

      setCategories(response.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response =
        await getSubCategoriesApi();

      setSubCategories(
        response.subCategories
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCategory = (
    categoryId
  ) => {
    setExpandedCategory(
      expandedCategory === categoryId
        ? null
        : categoryId
    );
  };

  const handleCheckboxChange = (
    subCategoryId
  ) => {
    setFilters({
      ...filters,
      [subCategoryId]:
        !filters[subCategoryId],
    });
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">
        Categories
      </h3>

      <ul className="category-list">
        <li className="all-categories">
          All categories
        </li>

        {categories.map((category) => (
          <li key={category._id}>
            <div
              className="category-toggle"
              onClick={() =>
                toggleCategory(
                  category._id
                )
              }
            >
              <span>
                {category.name}
              </span>

              <span>
                {expandedCategory ===
                category._id ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                )}
              </span>
            </div>

            {expandedCategory ===
              category._id && (
              <ul className="subcategory-list">
                {subCategories
                  .filter(
                    (sub) =>
                      sub.categoryId
                        ?._id ===
                      category._id
                  )
                  .map((sub) => (
                    <li key={sub._id}>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={
                            filters[
                              sub._id
                            ] || false
                          }
                          onChange={() =>
                            handleCheckboxChange(
                              sub._id
                            )
                          }
                        />
                        {sub.name}
                      </label>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
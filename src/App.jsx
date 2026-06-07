// import { useState } from "react";
import { useEffect, useState } from "react";
import { getProductsApi, searchProductsApi } from "./pages/Product";
import { Routes, Route, useLocation } from "react-router-dom";
import ProductDetails from "./pages/Productdetails";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import ModalManager from "./components/common/Modal";
import { useNavigate } from "react-router-dom";
import LoginSignup from "./pages/sigin";
import Signup from "./pages/SignUp";
import { addToWishlistApi } from "./pages/Product";
import Wishlist from "./pages/Wishlist";

import "./App.css";

function Home({ openModal }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const keyword = new URLSearchParams(location.search).get("search");

  const fetchProducts = async (pageNumber = 1) => {
    try {
      const response = await getProductsApi(pageNumber);

      setProducts(response.products);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        if (keyword && keyword.trim()) {
          const response = await searchProductsApi(keyword);

          setProducts(response.products);
          setTotalPages(1);
        } else {
          const response = await getProductsApi(page);

          setProducts(response.products);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadProducts();
  }, [page, keyword]);
  const handleWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please login first");
        return;
      }

      const response = await addToWishlistApi(userId, productId);

      alert(response.message);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to add wishlist");
    }
  };

  return (
    <>
      <div className="top-actions">
        <button onClick={() => openModal("category")}>Add category</button>

        <button onClick={() => openModal("subcategory")}>
          Add sub category
        </button>

        <button onClick={() => openModal("product")}>Add product</button>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            style={{ cursor: "pointer" }}
          >
            <div
              className="wishlist"
              onClick={(e) => {
                e.stopPropagation();
                handleWishlist(product._id);
              }}
            >
              ♡
            </div>

            <img
              src={product.images?.[0] || "https://via.placeholder.com/200"}
              alt={product.title}
            />

            <h4>{product.title}</h4>

            <p>₹{product.variants?.[0]?.price}</p>

            <div className="stars">★★★★★</div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={page === index + 1 ? "active" : ""}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}

function App() {
  const [modalType, setModalType] = useState(null);

  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  const openModal = (type) => setModalType(type);

  const closeModal = () => setModalType(null);

  return (
    <div className="app-container">
      {!hideLayout && <Navbar />}

      <div className="main-layout">
        {!hideLayout && <Sidebar />}

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home openModal={openModal} />} />

            <Route path="/product/:id" element={<ProductDetails />} />

            <Route path="/login" element={<LoginSignup />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>
      </div>

      <ModalManager
        type={modalType}
        isOpen={modalType !== null}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;

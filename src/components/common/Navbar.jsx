import React, { useState ,useEffect} from "react";
import "../../styles/Navbar.css";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getWishlistApi } from "../../pages/Product";

const Navbar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  const handleSearch = () => {
    navigate(`/?search=${keyword}`);
  };
  useEffect(() => {
    fetchWishlistCount();
  }, []);

  const fetchWishlistCount = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const response = await getWishlistApi(userId);

      setWishlistCount(response.wishlist.length);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search any things"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      <div className="nav-links">
        <div
          className="nav-item"
          onClick={() => navigate("/wishlist")}
          style={{ cursor: "pointer" }}
        >
          <AiOutlineHeart />
          <span className="badge">{wishlistCount}</span>
          <span>Wishlist</span>
        </div>

        <div
          className="nav-item"
          onClick={() => navigate("/login")}
          style={{ cursor: "pointer" }}
        >
          <span>Sign In</span>
        </div>

        <div className="nav-item">
          <AiOutlineShoppingCart />
          <span className="badge">0</span>
          <span>Cart</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

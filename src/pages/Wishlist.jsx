import { useEffect, useState } from "react";
import { getWishlistApi, removeFromWishlistApi } from "./Product";
import "../styles/Wishlist.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await getWishlistApi(userId);

      setWishlist(response.wishlist);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await removeFromWishlistApi(userId, productId);

      alert(response.message);

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to remove wishlist");
    }
  };

  return (
    <div className="wishlist-page">
      <h2>Wishlist Items</h2>

      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        wishlist.map((product) => (
          <div className="wishlist-card" key={product._id}>
            <img src={product.images?.[0]} alt={product.title} />

            <div className="wishlist-info">
              <h4>{product.title}</h4>

              <p>₹{product.variants?.[0]?.price}</p>
            </div>

            <button
              className="remove-btn"
              onClick={() => handleRemoveWishlist(product._id)}
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  );
}

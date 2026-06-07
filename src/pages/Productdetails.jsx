import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { getProductByIdApi } from "./Product";
import "../styles/ProductDetails.css";
import { addToWishlistApi } from "./Product";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByIdApi(id);

        setProduct(response.product);

        if (response.product.images?.length > 0) {
          setMainImage(response.product.images[0]);
        }

        if (response.product.variants?.length > 0) {
          setSelectedRam(response.product.variants[0].ram);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <h2>Loading...</h2>;
  }

  const selectedVariant =
    product.variants?.find((variant) => variant.ram === selectedRam) ||
    product.variants?.[0];

  const handleWishlist = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please login first");
        return;
      }

      const response = await addToWishlistApi(userId, product._id);

      alert(response.message);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to add wishlist");
    }
  };

  return (
    <div className="product-details">
      <div className="breadcrumb">Home &gt; Product Details</div>

      <div className="details-container">
        {/* Left Side */}
        <div className="gallery">
          <div className="main-image">
            <img
              src={mainImage || "https://via.placeholder.com/400"}
              alt={product.title}
            />
          </div>

          <div className="thumbnail-row">
            {product.images?.map((img, index) => (
              <div
                key={index}
                className="thumb"
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt={`thumb-${index}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h2>{product.title}</h2>

          <h3>₹{selectedVariant?.price || 0}</h3>

          <p className="stock">
            Availability:
            <span>
              {selectedVariant?.quantity > 0 ? " ✓ In Stock" : " Out Of Stock"}
            </span>
          </p>

          <p className="stock-note">
            Available Quantity : {selectedVariant?.quantity || 0}
          </p>

          <hr />

          <div className="ram-section">
            <label>RAM :</label>

            {product.variants?.map((variant, index) => (
              <button
                key={index}
                className={selectedRam === variant.ram ? "active-ram" : ""}
                onClick={() => setSelectedRam(variant.ram)}
              >
                {variant.ram}
              </button>
            ))}
          </div>

          <div className="qty-section">
            <label>Quantity :</label>

            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
              -
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="action-buttons">
            <button className="edit-btn">Edit Product</button>

            <button className="buy-btn">Buy It Now</button>

            <button className="wishlist-btn" onClick={handleWishlist}>
              <AiOutlineHeart />
            </button>
          </div>

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <h4>Description</h4>

            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const FALLBACK_IMAGE = "https://picsum.photos/seed/ecom-fallback/1200/900";

export default function CheckoutPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imageSrc, setImageSrc] = useState(FALLBACK_IMAGE);
  const [quantity, setQuantity] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setImageSrc(response.data?.imageUrl || FALLBACK_IMAGE);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load product"));
  }, [productId]);

  const subtotal = useMemo(() => Number(product?.price || 0) * quantity, [product?.price, quantity]);
  const shipping = 0;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      await api.post("/orders", {
        items: [{ productId, quantity }],
        paymentMethod: "COD"
      });
      navigate("/my-orders");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (error && !product) return <div className="surface-card p-6 text-[14px] text-[#c13515]">{error}</div>;
  if (!product) return <div className="surface-card p-6 text-[14px] text-[#6a6a6a]">Loading checkout...</div>;

  return (
    <section className="space-y-6">
      <h1 className="section-title">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="surface-card p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.32px] text-[#6a6a6a]">Order item</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-[220px_1fr]">
            <div className="overflow-hidden rounded-[14px] bg-[#f3f3f3]">
              <img alt={product.title} className="h-[220px] w-full object-cover" src={imageSrc} onError={() => setImageSrc(FALLBACK_IMAGE)} />
            </div>
            <div className="space-y-3">
              <Badge>{product.type || "General"}</Badge>
              <h2 className="text-[24px] font-semibold tracking-[-0.18px] text-[#222222]">{product.title}</h2>
              <p className="text-[14px] leading-[1.6] text-[#6a6a6a]">{product.description}</p>
              <p className="text-[22px] font-bold text-[#222222]">₹{Number(product.price || 0).toLocaleString("en-IN")}</p>
              <p className="text-[13px] font-medium text-[#6a6a6a]">Stock available: {product.stock}</p>
            </div>
          </div>
        </div>

        <aside className="surface-card p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.32px] text-[#6a6a6a]">Order summary</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-1 text-[13px] text-[#6a6a6a]">Quantity</p>
              <Input min="1" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
            </div>
            <div className="space-y-2 rounded-[12px] border border-[#ebebeb] p-4 text-[14px]">
              <div className="flex items-center justify-between">
                <span className="text-[#6a6a6a]">Subtotal</span>
                <span className="font-semibold text-[#222222]">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6a6a6a]">Shipping</span>
                <span className="font-semibold text-[#222222]">{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#ebebeb] pt-2">
                <span className="font-semibold text-[#222222]">Order total</span>
                <span className="text-[20px] font-bold text-[#222222]">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <p className="text-[12px] text-[#6a6a6a]">Payment method: Cash on Delivery</p>
            {error && <p className="text-[13px] text-[#c13515]">{error}</p>}
            <Button className="w-full !py-3" disabled={placing} onClick={placeOrder}>
              {placing ? "Placing order..." : "Place COD Order"}
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}


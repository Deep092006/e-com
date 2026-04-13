import { ArrowLeft, PackageCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../api";
import { Button } from "../components/ui/Button";

const FALLBACK_IMAGE = "https://picsum.photos/seed/ecom-fallback/1200/900";
const TRACKING_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const backTo = location.state?.from || "/my-orders";
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    api
      .get(`/orders/${orderId}`)
      .then((response) => setOrder(response.data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load order"));
  }, [orderId]);

  const itemTotal = useMemo(() => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  }, [order]);

  const statusIndex = useMemo(() => TRACKING_STEPS.indexOf(order?.status), [order?.status]);
  const canCancel = order && order.status !== "DELIVERED" && order.status !== "CANCELLED";

  const cancelOrder = async () => {
    setActionError("");
    setCanceling(true);
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      setOrder(response.data);
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to cancel order");
    } finally {
      setCanceling(false);
    }
  };

  if (error) return <div className="surface-card p-6 text-[14px] text-[#c13515]">{error}</div>;
  if (!order) return <div className="surface-card p-6 text-[14px] text-[#6a6a6a]">Loading order...</div>;

  return (
    <section className="space-y-5">
      <Link className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6a6a6a] hover:text-[#222222]" to={backTo}>
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <div className="surface-card p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.32px] text-[#6a6a6a]">Order details</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] text-[#6a6a6a]">Order ID</p>
            <p className="text-[15px] font-semibold text-[#222222]">{order._id}</p>
          </div>
          <span className="status-pill">{order.status}</span>
        </div>
        <div className="mt-4 grid gap-3 text-[14px] text-[#6a6a6a] sm:grid-cols-3">
          <p>Payment: {order.paymentMethod}</p>
          <p>Items: {order.items.length}</p>
          <p className="font-semibold text-[#222222]">Total: ₹{Number(order.totalAmount || itemTotal).toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <article className="surface-card p-4" key={`${order._id}-${idx}`}>
              <div className="grid gap-3 sm:grid-cols-[96px_1fr_auto] sm:items-start">
                <img
                  alt={item.title}
                  className="h-[96px] w-[96px] rounded-[10px] object-cover"
                  src={item.imageUrl || FALLBACK_IMAGE}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="space-y-1">
                  <p className="text-[16px] font-semibold text-[#222222]">{item.title}</p>
                  <p className="text-[13px] leading-[1.5] text-[#6a6a6a]">{item.description || "No description available."}</p>
                  <p className="text-[13px] text-[#6a6a6a]">Qty: {item.quantity}</p>
                </div>
                <p className="text-[15px] font-semibold text-[#222222]">₹{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString("en-IN")}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className="surface-card p-5">
          <div className="flex items-center gap-2">
            <PackageCheck size={16} className="text-[#222222]" />
            <p className="text-[15px] font-semibold text-[#222222]">Order Tracking</p>
          </div>
          {order.status === "CANCELLED" ? (
            <p className="mt-4 rounded-[10px] border border-[#ffd7df] bg-[#fff5f7] px-3 py-2 text-[13px] text-[#b32505]">Order has been cancelled.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {TRACKING_STEPS.map((step, idx) => {
                const done = idx <= statusIndex;
                return (
                  <div className="flex items-center gap-3" key={step}>
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${done ? "border-[#222222] bg-[#222222] text-white" : "border-[#d8d8d8] text-[#9a9a9a]"}`}>
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <p className={`text-[13px] ${done ? "font-semibold text-[#222222]" : "text-[#9a9a9a]"}`}>{step}</p>
                      {done && <span className="text-[10px] font-semibold uppercase tracking-[0.32px] text-[#2d7f43]">done</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {canCancel && (
            <div className="mt-5">
              <Button className="w-full" disabled={canceling} onClick={cancelOrder} variant="ghost">
                {canceling ? "Cancelling..." : "Cancel Order"}
              </Button>
            </div>
          )}
          {actionError && <p className="mt-3 text-[13px] text-[#c13515]">{actionError}</p>}
        </aside>
      </div>
    </section>
  );
}

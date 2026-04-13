import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

export default function ProductCard({ product, compact = false }) {
  const fallbackImage = "https://picsum.photos/seed/ecom-fallback/1200/900";
  const [imageSrc, setImageSrc] = useState(product.imageUrl || fallbackImage);

  useEffect(() => {
    setImageSrc(product.imageUrl || fallbackImage);
  }, [product.imageUrl]);

  return (
    <article className="surface-card overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <Link className="block" to={`/products/${product._id}`}>
        <div className="h-[240px] bg-[#f3f3f3]">
          <img alt={product.title} className="h-full w-full object-cover" src={imageSrc} onError={() => setImageSrc(fallbackImage)} />
        </div>

        <div className="space-y-2 p-4">
          <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-semibold tracking-[-0.18px]">{product.title}</h3>
          <p className="h-[40px] overflow-hidden text-[13px] leading-[1.5] text-[#6a6a6a]">{product.description}</p>
          <p className="pt-1 text-[18px] font-semibold">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}

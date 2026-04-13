import { CircleUserRound, Search, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("userId");
    setMenuOpen(false);
    navigate("/login");
  };

  const onSearch = (event) => {
    event.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
      return;
    }
    navigate("/products");
  };

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#ebebeb] bg-white/95 backdrop-blur">
      <div className="container-shell py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link className="flex items-center gap-2 text-[22px] font-bold tracking-[-0.44px] text-[#ff385c]" to="/">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ff385c] text-white">
              <ShoppingBag size={16} />
            </span>
            ECOM
          </Link>

          <div className="mx-auto hidden max-w-[480px] flex-1 md:block">
            <form className="surface-card flex items-center gap-2 rounded-[32px] border border-[#ebebeb] px-3 py-2 shadow-none" onSubmit={onSearch}>
              <Search size={16} className="text-[#6a6a6a]" />
              <input
                className="w-full border-none bg-transparent text-[14px] outline-none"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary rounded-full px-3 py-2 text-[12px]" type="submit">
                Search
              </button>
            </form>
          </div>

          <nav className="ml-auto flex items-center gap-2">
            <Link className="btn btn-light" to="/products">
              Shop
            </Link>
            {userId && (
              <>
                <Link className="btn btn-light hidden lg:inline-flex" to="/add-product">
                  Add Product
                </Link>
                <Link className="btn btn-light hidden lg:inline-flex" to="/my-orders">
                  My Orders
                </Link>
                <Link className="btn btn-light hidden lg:inline-flex" to="/seller-orders">
                  Seller
                </Link>
              </>
            )}
             {userId ? (
               <div className="relative" ref={menuRef}>
                 <button
                   aria-label="Profile menu"
                   className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[#222222] transition hover:shadow-[var(--shadow-hover)]"
                   onClick={() => setMenuOpen((prev) => !prev)}
                   type="button"
                 >
                   <CircleUserRound size={18} />
                 </button>
                 {menuOpen && (
                   <div className="absolute right-0 top-12 z-50 w-[170px] rounded-[12px] border border-[#ebebeb] bg-white p-2 shadow-[var(--shadow-hover)]">
                     <Link className="block rounded-[8px] px-3 py-2 text-[14px] text-[#222222] hover:bg-[#f7f7f7]" to="/profile" onClick={() => setMenuOpen(false)}>
                       Profile
                     </Link>
                     <button className="mt-1 w-full rounded-[8px] px-3 py-2 text-left text-[14px] text-[#222222] hover:bg-[#f7f7f7]" onClick={logout} type="button">
                       Logout
                     </button>
                   </div>
                 )}
               </div>
             ) : (
               <>
                 <Link className="btn btn-light" to="/signup">
                   Signup
                </Link>
                <Link className="btn btn-primary" to="/login">
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>

      </div>
    </header>
  );
}

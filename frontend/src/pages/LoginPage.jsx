import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const onSubmit = async (values) => {
    setErrorMessage("");
    try {
      const response = await api.post("/auth/login", values);
      localStorage.setItem("userId", response.data.userId);
      navigate("/");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="mx-auto max-w-lg">
      <div className="surface-card rounded-[28px] p-8">
        <h1 className="text-[34px] font-bold tracking-[-0.44px]">Welcome back</h1>
        <p className="mt-2 text-[14px] text-[#6a6a6a]">Login to manage orders, checkout, and seller tools.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input placeholder="Email" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="mt-1 text-[13px] text-[#c13515]">{errors.email.message}</p>}
          </div>

          <div>
            <Input placeholder="Password" type="password" {...register("password", { required: "Password is required" })} />
            {errors.password && <p className="mt-1 text-[13px] text-[#c13515]">{errors.password.message}</p>}
          </div>

          {errorMessage && <p className="text-[13px] text-[#c13515]">{errorMessage}</p>}

          <Button className="w-full !py-3" disabled={isSubmitting} type="submit" variant="dark">
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-[14px] text-[#6a6a6a]">
          New here?{" "}
          <Link className="font-semibold text-[#222222] underline underline-offset-4 hover:text-[#ff385c]" to="/signup">
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
}

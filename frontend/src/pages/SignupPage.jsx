import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function SignupPage() {
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
      const response = await api.post("/auth/signup", values);
      localStorage.setItem("userId", response.data.userId);
      navigate("/");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <section className="mx-auto max-w-lg">
      <div className="surface-card rounded-[28px] p-8">
        <h1 className="text-[34px] font-bold tracking-[-0.44px]">Create account</h1>
        <p className="mt-2 text-[14px] text-[#6a6a6a]">Join as buyer or seller and start using the marketplace.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input placeholder="Full name" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="mt-1 text-[13px] text-[#c13515]">{errors.name.message}</p>}
          </div>

          <div>
            <Input placeholder="Email" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="mt-1 text-[13px] text-[#c13515]">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              placeholder="Password"
              type="password"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
            />
            {errors.password && <p className="mt-1 text-[13px] text-[#c13515]">{errors.password.message}</p>}
          </div>

          {errorMessage && <p className="text-[13px] text-[#c13515]">{errorMessage}</p>}

          <Button className="w-full !py-3" disabled={isSubmitting} type="submit" variant="dark">
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-[14px] text-[#6a6a6a]">
          Already have an account?{" "}
          <Link className="font-semibold text-[#222222] underline underline-offset-4 hover:text-[#ff385c]" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

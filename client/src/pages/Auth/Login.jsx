import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import getErrorMessage from "../../utils/getErrorMessage";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-100 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-700">PharmaOps AI</h1>

          <p className="mt-2 text-secondary-500">
            Predictive Operations Command Center
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
            })}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 rounded-xl bg-secondary-50 p-4 text-sm">
          <p className="font-semibold text-secondary-700">Demo Credentials</p>

          <p className="mt-2">
            <strong>Email:</strong> admin@gmail.com
          </p>

          <p>
            <strong>Password:</strong> Admin@123
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;

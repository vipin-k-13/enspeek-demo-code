import Button from "../../../ui/Button";
import GoogleIcon from "../../../../assets/icons/GoogleIcon";
import Input from "../../../ui/Input";
import { LuArrowRight, LuEye, LuEyeOff } from "react-icons/lu";
import React from "react";
import { cn } from "../../../../utils";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../../services/apiService";
import LoaderSpinner from "../../../global/LoaderSpinner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store/store";
import { Login } from "../../../../store/UserSlice";

const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] =
    React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { mutate, isPending } = useMutation({
    mutationKey: ["Login"],
    mutationFn: async (obj: { username: string; password: string }) => {
      const res = await apiRequest("post", "user/login", obj);
      const data = await res.response;
      return data;
    },
    onSuccess: (data: any) => {
      dispatch(
        Login({
          ...data,
          apiToken: data.apitoken,
          firstName: data.firstname,
          lastName: data.lastname,
          userType: data.usertype,
        }),
      );
      toast.success("login successfully");
      navigate("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors: { email?: string; password?: string } = {};

    if (email === "") {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    const randomOne = Math.floor(Math.random() * 10) + 3;
    const randomTwo = Math.floor(Math.random() * 10) + 3;

    if (Object.keys(newErrors).length === 0) {
      mutate({
        username: email,
        password: btoa(randomOne + "&^" + password + "&^" + randomTwo),
      });
    }
  };

  return (
    <div className="w-full md:w-1/2 p-8 md:p-5 md:px-10 flex flex-col justify-center bg-gray-50">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">
          Welcome Back
        </h2>
        <p className="text-gray-500 mb-6">Sign in to your account</p>
        <Button varinat={"social"} className="cursor-not-allowed" disabled>
          <GoogleIcon />
          <span>Login with Google</span>
        </Button>
      </div>
      <div className="relative my-4">
        <div className=" absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">or</span>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-blue-500">*</span>
          </label>
          <Input
            id="email"
            data-test-id="EMAIL"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="bg-white border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password <span className="text-blue-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              data-test-id="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-gray-800 w-full pr-10 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <Button
          type="submit"
          data-test-id="SUBMIT"
          className={cn(
            "w-full relative overflow-hidden bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-all duration-300",
          )}
        >
          <span className="flex items-center justify-center">
            Sign in
            <LuArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
        <div className="text-center mt-2">
          <Button
            varinat={"link"}
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors cursor-not-allowed"
            disabled
          >
            Forgot password?
          </Button>
        </div>
      </form>
      {isPending && <LoaderSpinner />}
    </div>
  );
};

export default LoginForm;

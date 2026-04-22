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
import { ColoredLogo } from "../../../../assets/icons";

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
      toast.success("Login Successful!");
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
    <div className="w-full max-w-[32rem] rounded-[24px] border border-white/30 bg-login-card/95 px-5 py-7 shadow-[0_20px_60px_rgba(27,30,78,0.22)] backdrop-blur-sm sm:px-7 sm:py-9">
      <div className="mb-6 flex flex-col items-center text-center sm:mb-7">
        <div className="mb-5 inline-flex w-fit items-center justify-center gap-[5px]">
          <img src={ColoredLogo} alt="Enspeek" className="h-10 w-auto sm:h-11" />
          <span className="text-[2rem] font-bold leading-none text-login-primary">
            Enspeek
          </span>
        </div>
        <h2 className="text-[2rem] font-semibold leading-tight text-[#232542]">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-login-muted">Sign in to your account</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Input
            id="email"
            data-test-id="EMAIL"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-12 rounded-xl border-0 bg-login-input px-4 text-base text-login-input-text placeholder:text-[#a5a8bf] focus-visible:ring-2 focus-visible:ring-login-primary/40"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <div className="relative">
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              data-test-id="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-12 rounded-xl border-0 bg-login-input px-4 pr-11 text-base text-login-input-text placeholder:text-[#a5a8bf] focus-visible:ring-2 focus-visible:ring-login-primary/40"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#a2a6be] hover:text-[#7f839f]"
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
            "h-12 w-full rounded-xl bg-gradient-to-r from-login-primary to-login-bg-end text-base font-semibold text-white transition-all duration-300 hover:from-login-primary-hover hover:to-login-primary",
          )}
        >
          <span className="flex items-center justify-center">
            Sign in
            <LuArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#dddff0]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-login-card px-3 text-login-muted">or</span>
          </div>
        </div>
        <Button
          varinat={"social"}
          className="h-12 rounded-xl border border-[#e2e4f1] bg-white text-[15px] font-medium text-[#30334d] shadow-none hover:bg-[#f8f8fd] cursor-not-allowed"
          disabled
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </Button>
        <div className="text-center">
          <Button
            varinat={"link"}
            className="text-sm text-[#5f63e9] hover:text-[#4f56e6] transition-colors cursor-not-allowed"
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

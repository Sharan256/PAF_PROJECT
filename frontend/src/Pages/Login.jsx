import React from "react";
import { TEInput, TERipple } from "tw-elements-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import backgroundImg from "../images/bck1.jpg";

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special symbol"
    ),
});

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const onSubmit = async (data) => {
    const user = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post(`http://localhost:8080/users/login`, user);
      console.log(res.status);
      if (res.status === 200) {
        toast.success("Login successfully");
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/");
      }
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data);
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className="bg-indigo-50 "
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}

  
    >
      <section className="h-screen flex items-center justify-center p-20">
        <div className="container h-full p-10">
          <div className="g-6 flex h-full flex-wrap items-center lg:justify-start">
            <div
              className="md:w-full lg:w-[400px] rounded-lg"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
            >
              <form className="p-6 md:p-12" onSubmit={handleSubmit(onSubmit)}>
                <TEInput
                  type="email"
                  label="Email address"
                  size="lg"
                  className="mb-1"
                  {...register("email")}
                  isInvalid={
                    errors.email || (!errors.email && errors.email?.message)
                  }
                  onChange={(e) => {
                    trigger("email");
                  }}
                />
                {errors.email && (
                  <p className="mb-6 text-sm text-red-500">
                    {errors.email?.message}
                  </p>
                )}

                <TEInput
                  type="password"
                  label="Password"
                  className="mb-5"
                  size="lg"
                  {...register("password")}
                  isInvalid={
                    errors.password ||
                    (!errors.password && errors.password?.message)
                  }
                  onChange={(e) => {
                    trigger("password");
                  }}
                />
                {errors.password && (
                  <p className="mb-6 text-sm text-red-500">
                    {errors.password?.message}
                  </p>
                )}

                <TERipple rippleColor="light" className="w-full">
                  <button
                    type="submit"
                    className="mb-3 w-full rounded !bg-blue-600 px-7 py-3 text-sm font-medium uppercase text-white transition duration-150 ease-in-out hover:bg-blue-700 focus:outline-none active:bg-green-800"
                  >
                    {isSubmitting ? "Loading..." : "Sign In"}
                  </button>
                </TERipple>

                <TERipple rippleColor="light" className="w-full">
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full rounded bg-green-600 px-7 py-3 text-sm font-medium uppercase text-white transition duration-150 ease-in-out hover:bg-green-700 focus:outline-none active:bg-green-800"
                  >
                    Sign Up
                  </button>
                </TERipple>

                <div className="my-4 flex items-center before:flex-1 before:border-t before:border-white-300 after:flex-1 after:border-t after:border-white-300">
                  <p className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">
                    OR
                  </p>
                </div>

                <TERipple rippleColor="light" className="w-full">
                  <div
                    className="mb-3 flex w-full items-center justify-center rounded bg-orange-600 px-7 py-3 text-sm font-medium uppercase text-white transition duration-150 ease-in-out hover:bg-orange-700 focus:outline-none active:bg-orange-800 cursor-pointer"
                    onClick={handleGoogleLogin}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Continue with Google
                  </div>
                </TERipple>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TEInput, TERipple } from "tw-elements-react";
import * as yup from "yup";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../db/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import backgroundImg from "../images/bck.jpg";

const formSchema = yup.object().shape({
  username: yup.string().required().min(3).max(20),
  email: yup.string().email().required().trim(),
  password: yup
    .string()
    .required()
    .min(6)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special symbol"
    ),
  phone: yup
    .string()
    .required()
    .min(10)
    .matches(/^[0-9]+$/, "Phone number must contain only numeric characters"),
});

const storage = getStorage(app);

const Register = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  }

  function onImageChange(e) {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      setError("image", {
        type: "manual",
        message: "Please select at least one image",
      });
    }

    const currentFile = selectedFiles[0];
    setImage(currentFile);
  }

  const onSubmit = async (data) => {
    if (!image) {
      setError("image", {
        type: "manual",
        message: "Please select at least one image",
      });
      return;
    }

    const imageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    const newUser = {
      name: data.username,
      email: data.email,
      password: data.password,
      mobileNumber: data.phone,
      profileImage: imageUrl,
    };
    console.log(newUser);
    try {
      const response = await axios.post(
        `http://localhost:8080/users/register`,
        newUser
      );
      if (response.data) {
        toast.success("User created successfully");
        navigate("/login");
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
      className="bg-indigo-50"
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
          <div className="g-6 flex h-full flex-wrap items-center lg:justify-end">
            <div
              className="w-8/12 md:w-full lg:w-5/12 rounded-lg"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <form className="p-6 md:p-12" onSubmit={handleSubmit(onSubmit)}>
                <TEInput
                  type="text"
                  label="User Name"
                  size="lg"
                  className="mb-1 border border-blue-500 focus:border-blue-600"
                  {...register("username")}
                  isInvalid={errors.username}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                  {errors.username?.message}
                </p>

                <TEInput
                  type="email"
                  label="Email address"
                  size="lg"
                  className="mb-1"
                  {...register("email")}
                  isInvalid={errors.email}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                  {errors.email?.message}
                </p>

                <TEInput
                  type="password"
                  label="Password"
                  className="mb-1"
                  size="lg"
                  {...register("password")}
                  isInvalid={errors.password}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                  {errors.password?.message}
                </p>

                <TEInput
                  type="tel"
                  label="Phone Number"
                  size="lg"
                  className="mb-1"
                  {...register("phone")}
                  isInvalid={errors.phone}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                  {errors.phone?.message}
                </p>

                <div className="mb-3 w-96">
                  <label
                    htmlFor="formFile"
                    className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                  >
                    Select the Profile Picture
                  </label>
                  <input
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    type="file"
                    id="formFile"
                    onChange={onImageChange}
                  />
                  <p className="mb-6 text-sm text-red-500">
                    {errors.image?.message}
                  </p>
                </div>

                <TERipple rippleColor="light" className="w-full">
                  <button
                    type="submit"
                    className="mb-3 w-full rounded !bg-emerald-600 px-7 py-3 text-sm font-semibold uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-emerald-700 hover:shadow-lg focus:bg-emerald-700 focus:shadow-lg active:bg-emerald-800 active:shadow-lg"
                  >
                    {isSubmitting ? "Loading..." : "Register"}
                  </button>
                </TERipple>

                <TERipple rippleColor="light" className="w-full">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full rounded bg-blue-600 px-7 py-3 text-sm font-semibold uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg"
                  >
                    Sign in
                  </button>
                </TERipple>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;

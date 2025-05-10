import React, { useState, useEffect } from "react";
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
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

const formSchema = yup.object().shape({
  firstName: yup
  .string()
  .required("First name is required")
  .matches(/^[A-Za-z]+$/, "First name should only contain letters")
  .transform((value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ""
  ),

lastName: yup
  .string()
  .required("Last name is required")
  .matches(/^[A-Za-z]+$/, "Last name should only contain letters")
  .transform((value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ""
  ),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  countryCode: yup
    .string()
    .required("Country code is required")
    .matches(/^\+[0-9]{1,3}$/, "Invalid country code format"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{2,12}$/, "Phone number must be between 2 and 12 digits"),
  dateOfBirth: yup.object().shape({
    year: yup.string().required("Year is required"),
    month: yup.string().required("Month is required"),
    day: yup.string().required("Day is required"),
  }),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["male", "female", "custom"], "Please select a valid gender"),
});

const storage = getStorage(app);
const auth = getAuth(app);

const Register = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [customGender, setCustomGender] = useState("");
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("registerFormData");
    return savedData ? JSON.parse(savedData) : {};
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: formData,
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("registerFormData", JSON.stringify(value));
      setFormData(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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

  const handleGoogleSignUp = async () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const onSubmit = async (data) => {
    try {
      if (!image) {
        setError("image", {
          type: "manual",
          message: "Please select at least one image",
        });
        return;
      }

      // Validate date of birth
      const birthDate = new Date(
        parseInt(data.dateOfBirth.year),
        parseInt(data.dateOfBirth.month) - 1,
        parseInt(data.dateOfBirth.day)
      );
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 13 || (age === 13 && monthDiff < 0)) {
        setError("dateOfBirth", {
          type: "manual",
          message: "You must be at least 13 years old",
        });
        return;
      }

      // Upload image to Firebase
      const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Prepare user data
      const newUser = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        mobileNumber: `${data.countryCode}${data.phoneNumber}`,
        profileImage: imageUrl,
        dateOfBirth: birthDate.toISOString(),
        gender: data.gender === "custom" ? customGender : data.gender,
      };

      // Register user
      const response = await axios.post(
        `http://localhost:8080/users/register`,
        newUser
      );

      if (response.data) {
        toast.success("User created successfully");
        localStorage.removeItem("registerFormData"); // Clear saved form data
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error?.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    }
  };

  // Generate year options for date of birth
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <section className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Create Account</h2>
              <p className="text-gray-600 text-center mb-6 text-sm">Join our fitness community today</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        {...register("firstName")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm"
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        {...register("lastName")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm"
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Profile Picture Upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Profile Picture</label>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={image ? URL.createObjectURL(image) : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E5E7EB'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                          alt="Profile Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 bg-gray-50"
                        />
                        <label
                          htmlFor="profile-image-upload"
                          className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </label>
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={onImageChange}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          Upload a profile picture (JPG, PNG, GIF)
                        </p>
                        {image && (
                          <p className="text-xs text-green-600 mt-1">
                            Selected: {image.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors.image && (
                      <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Contact Information</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Country Code</label>
                      <input
                        type="text"
                        {...register("countryCode")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm"
                        placeholder="+XXX"
                      />
                      {errors.countryCode && (
                        <p className="text-xs text-red-500 mt-1">{errors.countryCode.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        {...register("phoneNumber")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm"
                        placeholder="Enter phone number"
                      />
                      {errors.phoneNumber && (
                        <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Security Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Account Security</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      {...register("password")}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm"
                      placeholder="Create a password"
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Additional Information</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        {...register("dateOfBirth.year")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm"
                      >
                        <option value="">Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <select
                        {...register("dateOfBirth.month")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm"
                      >
                        <option value="">Month</option>
                        {months.map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                      <select
                        {...register("dateOfBirth.day")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm"
                      >
                        <option value="">Day</option>
                        {days.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    {errors.dateOfBirth && (
                      <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="flex items-center p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all text-sm">
                        <input
                          type="radio"
                          value="male"
                          {...register("gender")}
                          className="mr-2"
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all text-sm">
                        <input
                          type="radio"
                          value="female"
                          {...register("gender")}
                          className="mr-2"
                        />
                        <span>Female</span>
                      </label>
                      <label className="flex items-center p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all text-sm">
                        <input
                          type="radio"
                          value="custom"
                          {...register("gender")}
                          className="mr-2"
                        />
                        <span>Custom</span>
                      </label>
                    </div>
                    {watch("gender") === "custom" && (
                      <input
                        type="text"
                        value={customGender}
                        onChange={(e) => setCustomGender(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 text-sm mt-2"
                        placeholder="Specify your gender"
                      />
                    )}
                    {errors.gender && (
                      <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full py-2 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-4 h-4"
                  />
                  <span>Sign up with Google</span>
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-xs text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;

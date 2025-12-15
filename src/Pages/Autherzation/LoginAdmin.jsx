import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setUser } from "../../Store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import "react-toastify/dist/ReactToastify.css";
import { usePost } from "@/Hooks/UsePost";
import { FaStethoscope, FaHeartbeat, FaUserMd, FaSyringe, FaEye, FaEyeSlash, } from "react-icons/fa";

const LoginAdmin = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/login` });
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const bgImage = container.dataset.bgImage;
          if (bgImage) {
            container.style.setProperty('--bg-image', `url(${bgImage})`);
            container.classList.add('loaded');
            observer.disconnect();
          }
        }
      },
      { rootMargin: '100px' }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Check for existing admin session
  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    const token = localStorage.getItem("token");

    if (adminData && token) {
      const parsedUser = JSON.parse(adminData);
      if (parsedUser?.role === "admin" && parsedUser.token === token) {
        dispatch(setUser(parsedUser));
        navigate("/", { replace: true });
      } else {
        // Clear invalid session
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
      }
    }
  }, [navigate, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      toast.error("Email/Username and password are required");
      return;
    }
    const body = new FormData();
    body.append("email", emailOrUsername);
    body.append("password", password);
    postData(body);
  };

  // Handle login response
  useEffect(() => {
    if (!loadingPost && response) {
      if (response.status === 200 && response.data?.user?.role === "admin") {
        dispatch(setUser(response?.data));
        localStorage.setItem("admin", JSON.stringify(response?.data));
        localStorage.setItem("token", response?.data.token);
        const redirectTo = new URLSearchParams(location.search).get("redirect");
        navigate(redirectTo || "/");
      }
      else if (response.data.message !== "Invalid credentials" &&
        response.status === 200 &&
        response.data?.user?.role !== "admin") {
        toast.error("You do not have admin privileges");
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
      }
      // else {
      //   toast.error(response.data.message || "Invalid Credentials");
      // }
    }
  }, [response, loadingPost]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full p-4 h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-bg-primary/40 to-white bg-cover bg-center relative overflow-hidden">
      {/* Doctor-themed background image */}
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/1200x/0e/82/d4/0e82d4cbbfd783d3d7245fcb927dd358.jpg')] bg-cover bg-center opacity-40"></div>

      {/* Decorative medical elements */}
      {/* <div className="absolute top-8 left-8 text-bg-primary opacity-30 text-6xl">
        <FaStethoscope />
      </div>
      <div className="absolute bottom-8 right-8 text-bg-primary opacity-30 text-6xl">
        <FaHeartbeat />
      </div>
      <div className="absolute top-1/4 right-12 text-bg-primary opacity-25 text-5xl">
        <FaUserMd />
      </div>
      <div className="absolute bottom-1/4 left-12 text-bg-primary opacity-25 text-5xl">
        <FaSyringe />
      </div> */}

      <div
        className="relative z-10 max-w-xl w-full"
      >
        <Card className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-bg-primary/50 overflow-hidden ring-1 ring-bg-primary/30">
          <CardContent className="p-6 md:p-8 lg:p-12">
            <div
              className="text-center mb-10"
            >
              <h2 className="text-5xl font-extrabold text-bg-primary tracking-tight bg-clip-text bg-gradient-to-r from-bg-primary to-blue-300">
                Login Mrfae
              </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div
                className="relative"
              >
                <Input
                  type="text"
                  placeholder="Email or Username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full p-4 pr-12 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                  disabled={loadingPost}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bg-primary">
                  <FaUserMd />
                </span>
              </div>

              <div
                className="relative"
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                  disabled={loadingPost}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-bg-primary hover:text-blue-700 transition-colors duration-200 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bg-primary">
                  <FaHeartbeat />
                </span>
              </div>

              <div
              >
                <Button
                  type="submit"
                  className="w-full p-4 py-6 text-lg bg-gradient-to-r from-bg-primary to-blue-300 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 shadow-lg"
                  disabled={loadingPost}
                >
                  {loadingPost ? "Logging in..." : "Login Mrfae"}
                </Button>
              </div>
            </form>

          </CardContent>
        </Card>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginAdmin;
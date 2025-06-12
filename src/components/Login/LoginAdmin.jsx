import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setUser } from "../../Store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import image from "../../assets/Login.png";
import "react-toastify/dist/ReactToastify.css";
import { usePost } from "@/Hooks/UsePost";

const LoginAdmin = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/login` });
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
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
            observer.disconnect(); // Stop observing once loaded
          }
        }
      },
      { rootMargin: '100px' } // Load 100px before entering viewport
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      toast.info("You are already logged in");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      toast.error("Email/Username and password are required");
      return;
    }
    const body = new FormData();
    body.append("email", emailOrUsername);
    body.append("password", password);
    postData(body, "Login successful!");
  };

  useEffect(() => {
    if (!loadingPost && response) {
      if (response.data?.user?.role === "admin") {
        dispatch(setUser(response?.data));
        localStorage.setItem("user", JSON.stringify(response?.data));
        localStorage.setItem("token", response?.data.token);
        const redirectTo = new URLSearchParams(location.search).get("redirect");
        navigate(redirectTo || "/");
      }
      else {
        toast.error("Invalid Credentials")
        navigate("/login");
      }
    }
  }, [response, loadingPost, navigate, dispatch]);

  return (
    <div className="login-container" data-bg-image={image} ref={containerRef}>
      <Card className="w-full md:max-w-2xl pb-10 md:p-10 bg-white shadow-lg rounded-lg">
        <CardContent>
          <h2 className="p-10 text-3xl font-bold text-center mb-6 text-bg-primary">Login</h2>
          <form onSubmit={handleLogin} className="space-y-7">
            <div>
              <Input
                type="text"
                placeholder="Email or Username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full p-3"
                disabled={loadingPost}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3"
                disabled={loadingPost}
              />
            </div>
            <Button
              type="submit"
              className="w-full p-6 bg-bg-secondary text-xl font-semibold text-white hover:bg-bg-secondary transition-colors duration-300"
              disabled={loadingPost}
            >
              {loadingPost ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default LoginAdmin;
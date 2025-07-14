
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import { setUser } from "../../Store/authSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import image from "../../assets/Login.png";
// import "react-toastify/dist/ReactToastify.css";
// import { usePost } from "@/Hooks/UsePost";

// const LoginAdmin = () => {
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/login` });
//   const [emailOrUsername, setEmailOrUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           const container = entry.target;
//           const bgImage = container.dataset.bgImage;
//           if (bgImage) {
//             container.style.setProperty('--bg-image', `url(${bgImage})`);
//             container.classList.add('loaded');
//             observer.disconnect();
//           }
//         }
//       },
//       { rootMargin: '100px' }
//     );
//     if (containerRef.current) {
//       observer.observe(containerRef.current);
//     }
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     const localUser = localStorage.getItem("admin"); // Changed from "user" to "admin"
//     if (localUser) {
//       const parsedUser = JSON.parse(localUser);
//       if (parsedUser?.user?.role === "admin") {
//         navigate("/", { replace: true });
//       } else {
//         localStorage.removeItem("admin");
//         localStorage.removeItem("token");
//       }
//     }
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!emailOrUsername || !password) {
//       toast.error("Email/Username and password are required");
//       return;
//     }
//     const body = new FormData();
//     body.append("email", emailOrUsername);
//     // body.append("password", password);
//     postData(body);
//   };

//   // In LoginAdmin.js
//   useEffect(() => {
//     if (!loadingPost && response) {
//       if (response.status === 200 && response.data?.user?.role === "admin") {
//         dispatch(setUser(response?.data?.user));
//         localStorage.setItem("admin", JSON.stringify(response?.data?.user));
//         localStorage.setItem("token", response?.data.token);
//         const redirectTo = new URLSearchParams(location.search).get("redirect");
//         navigate(redirectTo || "/");
//       }
//       else if (response.data.message !== "Invalid credentials" && response.status === 200 && response.data?.user?.role !== "admin") {
//         toast.error("You do not have admin privileges");
//       }
//       else {
//         toast.error("Invalid Credentials");
//       }
//     }
//   }, [response, loadingPost, navigate, dispatch, location]);

//   return (
//     <div className="login-container" data-bg-image={image} ref={containerRef}>
//       <Card className="w-full md:max-w-2xl pb-10 md:p-10 bg-white shadow-lg rounded-lg">
//         <CardContent>
//           <h2 className="p-10 text-3xl font-bold text-center mb-6 text-bg-primary">Login</h2>
//           <form onSubmit={handleLogin} className="space-y-7">
//             <div>
//               <Input
//                 type="text"
//                 placeholder="Email or Username"
//                 value={emailOrUsername}
//                 onChange={(e) => setEmailOrUsername(e.target.value)}
//                 className="w-full p-3"
//                 disabled={loadingPost}
//               />
//             </div>
//             <div>
//               <Input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-3"
//                 disabled={loadingPost}
//               />
//             </div>
//             <Button
//               type="submit"
//               className="w-full cursor-pointer p-6 bg-bg-secondary text-xl font-semibold text-white hover:bg-bg-secondary transition-colors duration-300"
//               disabled={loadingPost}
//             >
//               {loadingPost ? "Logging in..." : "Login"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//       <ToastContainer />
//     </div>
//   );
// };

// export default LoginAdmin;

import React, { useState, useEffect, useRef, useCallback } from "react";
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

  // Memoized login success handler
  const handleLoginSuccess = useCallback((userData, token) => {
    const userWithToken = {
      ...userData,
      token // Include token in the user object
    };
    
    dispatch(setUser(userWithToken));
    localStorage.setItem("admin", JSON.stringify(userWithToken));
    localStorage.setItem("token", token);
    
    const redirectTo = new URLSearchParams(location.search).get("redirect");
    navigate(redirectTo || "/");
  }, [dispatch, navigate, location.search]);

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
        handleLoginSuccess(response.data.user, response.data.token);
      }
      else if (response.data.message !== "Invalid credentials" && 
               response.status === 200 && 
               response.data?.user?.role !== "admin") {
        toast.error("You do not have admin privileges");
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
      }
      else {
        toast.error(response.data.message || "Invalid Credentials");
      }
    }
  }, [response, loadingPost, handleLoginSuccess]);

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
              className="w-full cursor-pointer p-6 bg-bg-secondary text-xl font-semibold text-white hover:bg-bg-secondary transition-colors duration-300"
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
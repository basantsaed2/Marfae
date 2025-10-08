import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

export const usePost = ({ url, login = false, type = false }) => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux store
  const [loadingPost, setLoadingPost] = useState(false);
  const [response, setResponse] = useState(null);

  const postData = async (data, name) => {
    setLoadingPost(true);

    try {
      const contentType = type ? 'application/json' : 'multipart/form-data';
      const config = !login && user?.token
        ? {
          headers: {
            'Content-Type': contentType,
            'Authorization': `Bearer ${user?.token || ''}`,
          },
        }
        : {
          headers: { 'Content-Type': contentType },
        };

      const response = await axios.post(url, data, config);

      if (response.status === 200 || response.status === 201) {
        { name ? toast.success(name) : '' }
        setResponse(response);
      }
    }
    catch (error) {
      console.error("Error post JSON:", error);
      if (error?.response?.data?.errors) {
        if (typeof error.response.data.errors === "object") {
          Object.entries(error.response.data.errors).forEach(
            ([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach((message) => {
                  toast.error(message);
                });
              } else {
                toast.error(messages);
              }
            }
          );
        } else {
          toast.error(error.response.data.errors);
        }
      } else if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message); // Display the general error message
      } else {
        toast.error("An unknown error occurred.");
      }

      // Still set the response for error cases to allow component to handle it
      setResponse(error.response);
      return error.response;
    }

    finally {
      setLoadingPost(false);
    }
  };

  return { postData, loadingPost, response };
};

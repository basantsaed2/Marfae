import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

export const useChangeState = () => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux store
  const [loadingChange, setLoadingChange] = useState(false);
  const [responseChange, setResponseChange] = useState(null);

  const changeState = async (url, name, data) => { // Accepting a single "data" object
    setLoadingChange(true);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${user?.token || ''}`,
        },
      };
      const response = await axios.put(url, data || {}, config);

      if (response.status === 200) {
        setResponseChange(response);
        toast.success(name);
        return true; // Return true on success
      }
    } catch (error) {
      console.error('Error post JSON:', error);

      // Check if the error response contains 'errors' or just a message
      if (error?.response?.data?.errors) {
        // Check if errors are an object (field-based errors)
        if (typeof error.response.data.errors === 'object') {
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            // If messages is an array, loop through them
            if (Array.isArray(messages)) {
              messages.forEach(message => {
                toast.error(message); // Display the error messages
              });
            } else {
              // If it's not an array, display the message directly
              toast.error(messages);
            }
          });
        } else {
          // If errors is not an object, assume it's just a message
          toast.error(error.response.data.errors);
        }
      } else if (error?.response?.data?.message) {
        // If there's a general message outside of the 'errors' object
        toast.error(error.response.data.message); // Display the general error message
      } else {
        // If no specific error messages are found, just display a fallback message
        toast.error('An unknown error occurred.');
      }
    } finally {
      setLoadingChange(false);
    }
  };

  return { changeState, loadingChange, responseChange };
};

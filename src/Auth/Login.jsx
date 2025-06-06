
import axios from "axios";

export const loginAuth = async (emailOrUsername, password) => {
  const response = await axios.post("https://bcknd.sea-go.org/api/village/login", {
    email: emailOrUsername,
    password,
  });
  return response.data;
};

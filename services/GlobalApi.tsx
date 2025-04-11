import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://192.168.0.102:1337/api",
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_KEY}`,
  },
});

const GetUserByEmail = (email: string) =>
  axiosClient.get("/user-lists?filters[email][$eq]=" + email);
const CreateNewUser = (data: any) =>
  axiosClient.post("/user-lists", { data: data });

export default {
  GetUserByEmail,
  CreateNewUser,
};

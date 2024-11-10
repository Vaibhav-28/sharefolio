import axios from "axios";

const API_URL = process.env.API_URL || "";

interface EmailData {
  email: string;
  userName: string;
  url: string;
}

const sendEmail = (data: EmailData) =>
  axios.post(`${API_URL}/api/send`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

const emailService = {
  sendEmail,
};

export default emailService;

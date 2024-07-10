import axios from "axios";
import { AUTH_BASED_URL } from "../network";

export const SignupURL = AUTH_BASED_URL + "/register";
export const SendOtp = AUTH_BASED_URL + "/api/send-otp"
export const ResendEmail = AUTH_BASED_URL + "/email/resend-verification";
export const VerifyEmail = AUTH_BASED_URL + "/email/verification";

export const SigninURL = AUTH_BASED_URL + "/login";

export const ForgetPassword = AUTH_BASED_URL + "/forgot-password";

export const SinginWithGoogle =  AUTH_BASED_URL + "/loign-with-google";
export const VerifyPhone =  AUTH_BASED_URL + "/api/check-phone-verification";

export const verifyMail = async (data: any) => {
  try {
    const response = await axios.post(VerifyEmail, data, {
      headers: { "Access-Control-Allow-Credentials": true },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const signIn = async (data: any) => {
  try {
    const response = await axios.post(SigninURL, data, {
      headers: { "Access-Control-Allow-Credentials": true },
    });
    return response.data;
  } catch (error:any) {
    console.log(error.response);
    return error.response;
  }
};

export const forgetLoginPassword = async (data: any) => {
  try {
    const response = await axios.post(ForgetPassword, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

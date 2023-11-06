import axios from "axios";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;
console.log(WEBSITE_URL);

export const getToken = async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${WEBSITE_URL}/wp-json/jwt-auth/v1/token`,
      data: {
        username: process.env.GATSBY_USERNAME,
        password: process.env.GATSBY_PASSWORD,
      },
      headers: {
        Accept: "application/json",
        // "Content-Type": "multipart/form-data",
        // "Access-Control-Allow-Origin": '*',
        // 'Access-Control-Allow-Headers': 'Accept',
        // "Access-Control-Allow-Credentials": 1
      },
    });
    return response.data.token;
  } catch (error) {
    console.error("TokenError", error);

    // throw error;
  }
};

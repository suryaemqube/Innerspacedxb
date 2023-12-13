import axios from "axios";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

export const getOptionData = async () => {
  try {
    const response = await axios({
      method: "get",
      url: `${WEBSITE_URL}/wp-json/custom/v1/acf-options`,
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Option page Error", error);
    throw error;
  }
};

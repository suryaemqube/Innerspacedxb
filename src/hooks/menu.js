import axios from "axios";

const WEBSITE_URL = process.env.GATSBY_BASE_URL;

const fetchMenu = async (menuName) => {
  try {
    const response = await axios.get(
      `${WEBSITE_URL}/wp-json/menus/v1/menus/${menuName}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`${menuName} menu page Error`, error);
    throw error;
  }
};

export const getPrimaryMenu = () => fetchMenu("primary");
export const getMobileMenu = () => fetchMenu("Mobile-menu");
export const getSecondaryMenu = () => fetchMenu("footer");

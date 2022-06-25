import axios from "axios";
import { catalogDetailUrl, customerUrl } from "./constants.js";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 5, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
});

const getCatalogItems = async ({ access_token, companyId }) => {
  const response = await axios.get(
    `https://api.covasoft.net/catalogs/v1/Companies(${companyId})/Catalog/Items`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  if (response.status === 200) {
    console.log("Catalog Items:", response.data);
    return response.data;
  } else {
    console.log("Something went wrong!");
    console.log(response.statusText);
  }
};

const getCatalogItemDetails = async ({
  catalogId,
  companyId,
  access_token,
}) => {
  const response = await axios.get(
    catalogDetailUrl({
      catalogId,
      companyId,
    }),
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  if (response.status === 200) {
    // products.push(response.data);
   
    // createJsonReport({
    //   data: products,
    //   fileName: `${clientId}_CatalogItems.json`,
    // });
    
    return response.data;
  } else {
    console.log("Something went wrong!");
    console.log(response.statusText);
    // 3298
    return null;
  }
};

let SKIP = 100;
let results = null;
const customers = [];

const getAllCustomers = async ({ access_token, companyId }) => {
  let params = new URLSearchParams();
  params.append("$skip", SKIP);
  params.append("$top", 100);
  const response = await axios.get(customerUrl(companyId), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    params,
  });
  let continueFetching = true;

  while (continueFetching) {
    if (results === 0) {
      continueFetching = false;
      return customers;
    } else {
      SKIP += 100;
      console.log("Customers:", response.request.path);
      results = response.data.length;
      console.log("RESULTS:", results);

      customers.push(...response.data);
      console.log(customers.length);
      await getAllCustomers({
        access_token,
        companyId,
      });
    }
  }
};

export { getCatalogItemDetails, getCatalogItems, getAllCustomers };

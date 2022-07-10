import fs from "node:fs/promises";
import axios from "axios";
import chalk from "chalk";
import {
  getAllCustomers,
  getCatalogItemDetails,
  getCatalogItems,
  getCustomerDetails,
  getCustomerOrderSummaries,
  getCustomerOrderSummaryDetails,
} from "./handlers.js";
import { convertToCSV } from "./utils.js";

class CovaDataAPI {
  constructor({ clientId, clientSecret, username, password, companyId }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.username = username;
    this.password = password;
    this.companyId = companyId;
  }

  async login() {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", this.username);
    params.append("password", this.password);
    params.append("client_id", this.clientId);
    params.append("client_secret", this.clientSecret);

    const { data } = await axios.post(
      `https://accounts.iqmetrix.net/v1/oauth2/token`,
      params,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  }

  async getCatalog() {
    try {
      const companyId = this.companyId;
      console.log(chalk.blueBright("Logining...."));
      const { access_token } = await this.login();
      console.log(chalk.blueBright("Logged in!"));
      console.log(
        chalk.blueBright(
          `Getting catalog items for company: ${chalk.green(companyId)}`
        )
      );
      const catalogs = await getCatalogItems({
        access_token,
        companyId,
      });

      console.log(
        chalk.green(`Catalogs Found: ${chalk.green(catalogs.length)}`)
      );
      console.log(chalk.blueBright("Getting Catalog Item Details...."));
      const catalogDetails = [];
      for (let catalog of catalogs) {
        const catalogItem = await getCatalogItemDetails({
          catalogId: catalog.CatalogItemId,
          companyId,
          access_token,
        });
        catalogDetails.push(catalogItem);
        console.log(
          chalk.green(
            `Catalog Item Details Found: ${chalk.green(catalogDetails.length)}`
          )
        );
      }
      await this.createJsonReport({
        data: catalogDetails,
        fileName: this.clientId + "_CatalogItems",
      });
    } catch (error) {
      if (error.isAxiosError) {
        throw new Error(`Something went wrong! ${error?.response.status}`);
      } else {
        throw new Error(`Something went wrong! ${error.message}`);
      }
    }
  }

  async getCustomers() {
    const customerDetails = [];
    const newCustomers = [];
    try {
      const { access_token } = await this.login();
      const customers = await getAllCustomers({
        access_token,
        companyId: this.companyId,
      });
      for (let customer of customers) {
        console.log("Customer:", customers.length);
        const customerDetail = await getCustomerDetails({
          access_token,
          companyId: this.companyId,
          customerId: customer.Id,
        });
        customerDetails.push(customerDetail);
        console.log("COLLECTED", customerDetails.length);
      }

      for (let customer of customerDetails) {
        let c = customer?.ContactMethods?.map((contact) => ({
          Id: customer.Id,
          Email:
            contact?.ContactMethodCategory === "Email" ? contact.Value : null,
          Phone:
            contact?.ContactMethodCategory === "Phone" ? contact.Value : null,
          PrimaryName: customer.PrimaryName,
          Title: customer.Title,
          AlternateName: customer.AlternateName,
          MiddleName: customer.MiddleName,
          FamilyName: customer.FamilyName,
          ReferralSource: customer.ReferralSource,
          Notes: customer.Notes,
          UniqueIdentifier: customer.UniqueIdentifier,
          CustomerTypeId: customer.CustomerTypeId,
          CustomerType: customer.CustomerType,
          DateOfBirth: customer.DateOfBirth,
          PricingGroupId: customer.PricingGroupId,
          Disabled: customer.Disabled,
          DoNotContact: customer.DoNotContact,
          Version: customer.Version,
          MergedIntoCustomerId: customer.MergedIntoCustomerId,
          LastModifiedDateUtc: customer.LastModifiedDateUtc,
        }));
        newCustomers.push(...c);
      }

      console.log(
        chalk.blueBright(`Customers Found: ${chalk.green(newCustomers.length)}`)
      );

      console.log(chalk.blueBright("Creating a CSV report for customers...."));

      await this.createCsvReport({
        fileName: this.clientId + "_Customers",
        jsonObject: newCustomers,
      });
    } catch (error) {
      if (error.isAxiosError) {
        throw new Error(error.response.data);
      } else {
        throw new Error(`Something went wrong! ${error?.message}`);
      }
    }
  }

  async getCustomersOrders() {
    try {
      const orders = [];
      const orderDetails = [];
      const companyId = this.companyId;
      const { access_token } = await this.login();
      const customers = await getAllCustomers({
        access_token: access_token,
        companyId,
      });
      console.log(
        chalk.blueBright(`Customers Found: ${chalk.green(customers.length)}`)
      );
      for (let customer of customers) {
        const customerOrders = await getCustomerOrderSummaries({
          access_token,
          companyId,
          customerId: customer.Id,
        });
        orders.push(...customerOrders);
        console.log(
          chalk.green(`Customer Orders Found: ${chalk.green(orders.length)}`)
        );
        if (orders.length >= 4000) {
          break;
        }
      }
      console.log(
        chalk.blueBright(`Customer Orders Found: ${chalk.green(orders.length)}`)
      );
      console.log(chalk.blueBright("Getting Customer Order Details...."));
      for (let order of orders) {
        const orderDetail = await getCustomerOrderSummaryDetails({
          access_token,
          companyId,
          invoiceId: order.Id,
        });
        orderDetails.push(orderDetail);
        console.log(
          chalk.green(
            `Customer Order Details Found: ${chalk.green(orderDetails.length)}`
          )
        );
      }
      await this.createJsonReport({
        data: orderDetails,
        fileName: this.clientId + "_CustomerOrders",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createJsonReport({ data, fileName }) {
    await fs.mkdir("./reports", { recursive: true });
    const filePath = `./reports/${fileName}.json`;
    await fs.writeFile(filePath, JSON.stringify(data, null, 4));
    console.log(chalk.green("JSON report created successfully!"));
  }
  async createCsvReport({ jsonObject, fileName }) {
    const filePath = `./reports/${fileName}.csv`;
    const results = convertToCSV(jsonObject);
    await fs.writeFile(filePath, results, {
      encoding: "utf-8",
    });
    console.log(chalk.green("CSV report created successfully!"));
  }
}

export { CovaDataAPI };

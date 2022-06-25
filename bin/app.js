#!/usr/bin/env node

import { config } from "dotenv";
config();
import fs from "node:fs/promises";
import yargs from "yargs";
import chalk from "chalk";
import { CovaDataAPI } from "../process.js";
import { sendEmail } from "../utils.js";

const options = yargs(process.argv.slice(2))
  .usage("Usage: cova [options]")
  .option("o", {
    alias: "operation",
    describe: "customers | catalogs | orders",
    type: "string",
    demandOption: true,
    choices: ["customers", "catalogs", "orders"],
  })
  .option("c", {
    alias: "companyId",
    describe: "companyId",
    type: "string",
    demandOption: true,
  })
  .option("u", {
    alias: "username",
    describe: "username",
    type: "string",
    demandOption: true,
  })
  .option("p", {
    alias: "password",
    describe: "password",
    type: "string",
    demandOption: true,
  })
  .option("e", {
    alias: "emailList",
    describe: "A string of email list separated by comma",
    type: "string",
    demandOption: true,
  })
  .option("i", {
    alias: "clientId",
    describe: "clientId",
    type: "string",
    demandOption: true,
  })
  .option("s", {
    alias: "clientSecret",
    describe: "clientSecret",
    type: "string",
    demandOption: true,
  }).argv;

const covadata = new CovaDataAPI({
  clientId: options.clientId,
  clientSecret: options.clientSecret,
  username: options.username,
  password: options.password,
  companyId: options.companyId,
});

(async () => {
  try {
    if (options.operation === "customers") {
      const filename = options.clientId + "_Customers" + ".csv";
      await covadata.getCustomers();
      await sendEmail({
        filename,
        mailTo: options.emailList,
        subject: "Customers Cova Data",
        dataType: "customers",
      });
      console.log(
        chalk.yellow(
          `Email sent to [ ${chalk.green(options.emailList)} ] successfully!`
        )
      );
      await fs.unlink(`./reports/${filename}`);
    } else if (options.operation === "catalogs") {
      const filename = options.clientId + "_CatalogItems" + ".json";
      await covadata.getCatalog();
      await sendEmail({
        filename: options.clientId + "_CatalogItems" + ".json",
        mailTo: options.emailList,
        subject: "Customers Cova Data",
        dataType: "catalogs",
      });
      console.log(
        chalk.yellow(
          `Email sent to [ ${chalk.green(options.emailList)} ] successfully!`
        )
      );
      await fs.unlink(`./reports/${filename}`);
    } else if (options.operation === "orders") {
      await covadata.getCustomersOrders();
      console.log(chalk.yellow("Customers Orders Found!"));
    } else {
      throw new Error(`Invalid operation: ${options.operation}`);
    }
  } catch (error) {
    console.log(chalk.red.bold(error.message));
  }
})();

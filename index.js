require("dotenv").config();
const chalk = require("chalk");
const express = require("express");
const { createServer } = require("http");

const serverConfig = require("./server");
const { ON_RELEASE, MSG } = require("./constant");

const app = express();
const server = createServer(app);

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, async () => {
  try {
    await serverConfig(app);
    ON_RELEASE || console.log(chalk.green(MSG.SERVER_START_SUCCESS));
  } catch (error) {
    ON_RELEASE || console.log(`${chalk.red(MSG.SERVER_START_FAILURE)}: ${error.message}`);
    process.exit(-1);
  }
});

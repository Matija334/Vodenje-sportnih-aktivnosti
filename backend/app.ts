import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {eventRoutes} from "./src/routes/events";
import { usersRoutes } from "./src/routes/users";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 1234;

app.use("/api/events", eventRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

import * as dotenv from "dotenv";
import App from "./App";
import { bodyRes, jsonRes } from "./data/parser";
import createUserRouter from "./controller/userRouter";

dotenv.config();

const PORT = process.env.PORT || 4000;
const BASE_URL = `http://localhost:${PORT}`;

export const app = new App(BASE_URL);
app.use(bodyRes);
app.use(jsonRes);

const userRouter = createUserRouter(app);
app.addRouter(userRouter);

const start = async () => {
  try {
    app.listen(+PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

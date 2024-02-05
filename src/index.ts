import * as dotenv from "dotenv";
import App from "./App";

dotenv.config();

const PORT = process.env.PORT || 4000;

export const app = new App();

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

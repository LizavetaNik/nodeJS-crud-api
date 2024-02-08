import cluster from "cluster";
import * as dotenv from "dotenv";
import AppBalancer from "../src/balancer/appBalancer";
import { bodyReq, jsonReq, urlReq } from "./data/parser";
import createUserRouter from "./balancer/userRouterBalancer";
import LoadBalancer from "./balancer/loadBalancer";
import { User } from "./data/data";

dotenv.config();

export const PORT = Number(process.env.PORT || 5000);
const BASE_URL = `http://localhost:${PORT}`;
export const usersGeneral = [] as User[];

const start = async () => {
  try {
    if (cluster.isPrimary) {
      const balancer = new LoadBalancer();

      balancer.activate(PORT, () => {
        console.log(`Load Balancer started on port ${PORT}`);
      });
    } else {
      const workerPort = PORT + cluster.worker!.id;
      const API_URL =
        process.env.BASE_URL + `:${workerPort}` || "http://localhost:5000";

      const appWithBalance = new AppBalancer();
      appWithBalance.use(bodyReq);
      appWithBalance.use(jsonReq);
      appWithBalance.use(urlReq(BASE_URL));

      const userRouter = createUserRouter(appWithBalance);
      appWithBalance.addRouter(userRouter);

      appWithBalance.listen(+workerPort, () => {
        console.log(`Server started on port ${workerPort}`);
      });
    }
  } catch (e) {
    console.log(e);
  }
};

start();

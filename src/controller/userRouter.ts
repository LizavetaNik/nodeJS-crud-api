import Router from "./router";
import { getUser } from "./user";
import { Req, Res } from "../data/data";
import App from "../App";

export default function createUserRouter(app: App): Router {
  const router = new Router();
  router.get("/api/users", (req: Req, res: Res) => {
    try {
      const userData = getUser(app.getDB());
      res.writeHead(userData.code, { "Content-Type": "application/json" });
      res.end(JSON.stringify(userData.data));
    } catch (e) {
      console.log(e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  });

  return router;
}

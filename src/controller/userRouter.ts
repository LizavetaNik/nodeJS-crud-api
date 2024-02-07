import Router from "./router";
import { getUsers } from "./user";
import { Req, Res, StatusCodes } from "../data/data";
import App from "../App";
import { v4 as uuidv4 } from "uuid";

export default function createUserRouter(app: App): Router {
  const router = new Router();
  router.get("/api/users", (req: Req, res: Res) => {
    try {
      const userData = getUsers(app.getDB());
      res.writeHead(userData.code, { "Content-Type": "application/json" });
      res.end(JSON.stringify(userData.data));
    } catch (e) {
      console.log(e);
      res.writeHead(StatusCodes.OTHERERR, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  });

  router.get("/api/users/:userId", (req: Req, res: Res) => {
    try {
      const url = req.url;
      const parts = url ? url.split("/") : "";
      const userIdWithColon = parts[parts.length - 1];
      const userId = userIdWithColon.substring(1);

      if (!checkIfValidUUID(userId)) {
        res.writeHead(StatusCodes.INVALID, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ message: "Invalid userId" }));
        return;
      }

      const user = app.getDB().find((user) => user.id === userId);

      if (!user) {
        res.writeHead(StatusCodes.NOTEXIST, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ message: "User not found" }));
        return;
      }

      res.writeHead(StatusCodes.OK, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(user));
    } catch (e) {
      console.log(e);
      res.writeHead(StatusCodes.OTHERERR, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  });

  router.post("/api/users", (req: Req, res: Res) => {
    try {
      const body = req.body;
      console.log(body.age);
      const errValidator = validateUser(body.username, body.age, body.hobbies);
      console.log(errValidator);
      if (errValidator.length > 0) {
        res.writeHead(StatusCodes.INVALID, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ message: errValidator.join("; ") }));
        return;
      }

      const newUser = {
        id: generateUUID(),
        username: body.username,
        age: body.age,
        hobbies: body.hobbies,
      };

      app.addToDB(newUser);

      res.writeHead(StatusCodes.CREATED, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(newUser));
    } catch (e) {
      console.log(e);
      res.writeHead(StatusCodes.OTHERERR, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  });

  return router;
}

const checkIfValidUUID = (str: string): boolean => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
};

const generateUUID = (): string => {
  return uuidv4();
};

const validateUsername = (username: any): string => {
  if (typeof username !== "string" || username.length === 0) {
    return "Invalid username";
  }
  return "";
};

const validateAge = (age: any): string => {
  if (typeof age !== "number" || age < 0) {
    return "Invalid age value";
  }
  return "";
};

const validateHobbies = (hobbies: any): string => {
  if (
    !Array.isArray(hobbies) ||
    hobbies.some((item) => typeof item !== "string")
  ) {
    return "Invalid hobbies";
  }
  return "";
};

const validateUser = (username: any, age: any, hobbies: any): string[] => {
  return [
    validateUsername(username),
    validateAge(age),
    validateHobbies(hobbies),
  ].filter((message) => message !== "");
};

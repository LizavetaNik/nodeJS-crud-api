import http, { createServer, IncomingMessage, ServerResponse } from "http";
import EventEmitter from "events";
import Router from "./controller/router";
import { Middleware, Req, Res, User } from "./data/data";

class App {
  db: User[];
  emitter: EventEmitter;
  middlewares: Middleware[];
  server: http.Server<typeof IncomingMessage, typeof ServerResponse>;
  sockets: Set<any>;

  constructor() {
    this.db = [];
    this.emitter = new EventEmitter();
    this.middlewares = [];
    this.server = this.createServer();
    this.sockets = new Set();
  }

  getDB(): User[] {
    return this.db;
  }

  addToDB(user: User): void {
    this.db.push(user);
  }

  deleteToDB(id: string): boolean {
    const index = this.db.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.db.splice(index, 1);
      return true;
    }
    return false;
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  listen(port: number, callback: () => void) {
    this.server.on("connection", (socket) => {
      this.sockets.add(socket);

      this.server.once("close", () => {
        this.sockets.delete(socket);
      });
    });

    this.server.listen(port, callback);
  }

  close(callback: () => void) {
    setImmediate(() => {
      this.server.emit("close");
    });

    this.sockets.forEach((val: any) => {
      val.destroy();
      this.sockets.delete(val);
    });

    this.server.closeAllConnections();
    this.server.close(callback);

    callback();
  }

  addRouter(router: Router) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path];
      Object.keys(endpoint).forEach((method) => {
        this.emitter.on(this.getRouteParser(path, method), (req, res) => {
          const handler = endpoint[method];
          handler(req, res);
        });
      });
    });
  }

  private getRouteParser(path: any, method: any) {
    return `[${path.replace(/:\w+/g, "*")}]:[${method}]`;
  }

  createServer() {
    return createServer((req: Req, res: any) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        this.middlewares.forEach((middleware) => middleware(req, res, body));

        const emitted = this.emitter.emit(
          this.getRouteParser(req.pathname || "", req.method || ""),
          req,
          res
        );

        if (!emitted || req.errorStatus) {
          try {
            (res as Res).writeHead(req.errorStatus || 404);
            (res as Res).end(req.err ? req.errorMessage : "Page not found");
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  }
}
export default App;

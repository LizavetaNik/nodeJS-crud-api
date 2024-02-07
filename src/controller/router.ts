import { Endpoints, Methods } from "../data/data";

class Router {
  endpoints: Endpoints;

  constructor() {
    this.endpoints = {};
  }

  request(method: Methods, path: string, handler: () => void) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};
    }

    const endpoint = this.endpoints[path];

    if (this.hasHandler(endpoint, method)) {
      throw new Error(`${method} on address ${path} already exists!`);
    }

    this.addHandler(endpoint, method, handler);
  }

  private hasHandler(
    endpoint: Record<Methods, () => void>,
    method: Methods
  ): boolean {
    return !!endpoint[method];
  }

  private addHandler(
    endpoint: Record<Methods, () => void>,
    method: Methods,
    handler: () => void
  ) {
    endpoint[method] = handler;
  }

  get(path: string, handler: any) {
    this.request(Methods.GET, path, handler);
  }

  post(path: string, handler: any) {
    this.request(Methods.POST, path, handler);
  }

  put(path: string, handler: any) {
    this.request(Methods.PUT, path, handler);
  }

  delete(path: string, handler: any) {
    this.request(Methods.DELETE, path, handler);
  }
}

export default Router;

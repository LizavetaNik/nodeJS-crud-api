import { Req, Res } from "./data";

export const bodyReq = (req: Req, res: Res, body: any) => {
  try {
    if (body) {
      req.body = JSON.parse(body);
    }
  } catch (e: any) {
    {
      req.errorMessage = "Failed to parse request body";
      if (e?.message) {
        req.errorMessage += `; ${e.message}`;
      }
      req.errorStatus = 500;
    }
  }
};

export const jsonReq = (req: any, res: any, _: any) => {
  res.send = (data: any, statusCode: number = 200) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };
};

export const urlReq = (baseUrl: string) => (req: Req, res: any, _: any) => {
  let url = req.url;

  if (!url) {
    return;
  }

  if (url.endsWith("/")) {
    url = url.slice(0, url.length - 1);
  }
  const parsedUrl = new URL(url, baseUrl);
  const pathnameParts = url.split("/");

  if (
    pathnameParts.length > 4 ||
    pathnameParts.slice(0, 3).join("/") !== "/api/users"
  ) {
    return;
  }
  const id = pathnameParts[3];

  if (id) {
    req.id = id;
    pathnameParts.pop();
    req.pathname = pathnameParts.join("/") + "/:userId";
    return;
  }
  req.pathname = parsedUrl.pathname;
  req.id = id;
};

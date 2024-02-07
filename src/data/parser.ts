import { Req, Res } from "./data";

export const bodyRes = (req: Req, res: Res, body: any) => {
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

export const jsonRes = (req: any, res: any, _: any) => {
  res.send = (data: any, statusCode: number = 200) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };
};

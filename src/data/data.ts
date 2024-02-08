import { IncomingMessage, ServerResponse } from "http";

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface UserResponse {
  code: number;
  data: User | User[] | string;
}

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const enum StatusCodes {
  OK = 200,
  CREATED = 201,
  NOCONTENT = 204,
  INVALID = 400,
  NOTEXIST = 404,
  OTHERERR = 500,
}

export type Endpoints = {
  [key: string]: any;
};

export interface Req extends IncomingMessage {
  body?: any;
  pathname?: string;
  err?: any;
  errorStatus?: number;
  errorMessage?: string;
  id?: string;
}

export interface Res extends ServerResponse<Req> {
  req: Req;
  send: (data: any, code?: number) => void;
}

export type Middleware = (req: Req, res: Res, body: any) => void;

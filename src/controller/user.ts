import { User, UserResponse, StatusCodes } from "../data/data";

export function getUser(db: User[]): UserResponse {
  return {
    code: StatusCodes.OK,
    data: db,
  };
}

import { User, UserResponse, StatusCodes } from "../data/data";

export function getUsers(db: User[]): UserResponse {
  return {
    code: StatusCodes.OK,
    data: db,
  };
}

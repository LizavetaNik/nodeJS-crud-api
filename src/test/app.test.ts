import request from "supertest";
import { app } from "../index";
import { User } from "../data/data";

const mockUser: Omit<User, "id"> = {
  username: "Max",
  age: 18,
  hobbies: ["football", "basketball"],
};

const mockUserSecond: Omit<User, "id"> = {
  username: "Ivan",
  age: 19,
  hobbies: ["football"],
};

const mockUserUpdate: Omit<User, "id"> = {
  username: "Max Acc",
  age: 20,
  hobbies: ["football", "basketball", "volleyball"],
};

describe("Case 1", () => {
  const response = request(app.server);
  let userId: any;

  afterAll((done) => {
    app.close(() => {});
    done();
  });

  it("should GET all users and return empty array", async () => {
    const res = await response.get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should POST and add new user", async () => {
    const res = await response.post("/api/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    const user = res.body as User;
    userId = user.id;
    expect(user.username).toBe(mockUser.username);
    expect(user.age).toBe(mockUser.age);
    expect(user.hobbies).toEqual(mockUser.hobbies);
  });

  it("should GET user by pathname with userID", async () => {
    const res = await response.get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    const user = res.body as User;
    expect(user?.username).toBe(mockUser.username);
    expect(user?.age).toBe(mockUser.age);
    expect(user?.hobbies).toEqual(mockUser.hobbies);
  });

  it("should PUT and update user", async () => {
    const res = await response.put(`/api/users/${userId}`).send(mockUserUpdate);
    expect(res.statusCode).toBe(200);
    const user = res.body as User;
    expect(user?.username).toBe(mockUserUpdate.username);
    expect(user?.age).toBe(mockUserUpdate.age);
    expect(user?.hobbies).toEqual(mockUserUpdate.hobbies);
  });

  it("should DELETE and delete user", async () => {
    const res = await response.delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);
  });

  it("should GET user by pathname with userID and return error", async () => {
    const res = await response.get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("Case 2", () => {
  const response = request(app.server);
  let userId: any;

  afterAll((done) => {
    app.close(() => {});
    done();
  });

  it("should GET all users and return empty array", async () => {
    const res = await response.get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should POST and add new user", async () => {
    const res = await response.post("/api/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    const user = res.body as User;
    userId = user.id;
    expect(user.username).toBe(mockUser.username);
    expect(user.age).toBe(mockUser.age);
    expect(user.hobbies).toEqual(mockUser.hobbies);
  });

  it("should PUT and receive error response for updating user with invalid age", async () => {
    const invalidAgeUser = { ...mockUser, age: -5 };
    const res = await response.put(`/api/users/${userId}`).send(invalidAgeUser);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('{"message":"Invalid age value"}');
  });

  it("should PUT user without ID in URL and receive error response", async () => {
    const res = await response.put(`/api/users`).send(mockUser);
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("Page not found");
  });

  it("should DELETE and delete user", async () => {
    const res = await response.delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);
  });
});

describe("Case 3", () => {
  const response = request(app.server);
  let userId: any;

  afterAll((done) => {
    app.close(() => {});
    done();
  });

  it("should GET all users and return empty array", async () => {
    const res = await response.get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should GET unknown url and receive error response", async () => {
    const res = await response.get("/api/some-api");
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("Page not found");
  });

  it("should POST and add first user", async () => {
    const res = await response.post("/api/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    const user = res.body as User;
    userId = user.id;
    expect(user.username).toBe(mockUser.username);
    expect(user.age).toBe(mockUser.age);
    expect(user.hobbies).toEqual(mockUser.hobbies);
  });

  it("should POST and add second user", async () => {
    const res = await response.post("/api/users").send(mockUserSecond);
    expect(res.statusCode).toBe(201);
    const user = res.body as User;
    userId = user.id;
    expect(user.username).toBe(mockUserSecond.username);
    expect(user.age).toBe(mockUserSecond.age);
    expect(user.hobbies).toEqual(mockUserSecond.hobbies);
  });

  it("should GET all users", async () => {
    const res = await response.get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("should PUT user with incorrect JSON and return error hobbies", async () => {
    const res = await response
      .put(`/api/users/${userId}`)
      .send({ ...mockUser, hobbies: null });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('{"message":"Invalid hobbies"}');
  });
});

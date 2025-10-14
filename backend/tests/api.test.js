import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/server.js"; // se till att du exporterar app i server.js

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.booking.deleteMany();
  await prisma.request.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("User routes", () => {
  test("registers a new user A", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "testA@test.com", password: "A123456" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("username", "testA@test.com");
  });

  test("registers a new user B", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "testB@test.com", password: "B123456" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("username", "testB@test.com");
  });

  test("logs in user A and returns JWT", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testA@test.com", password: "A123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("logs in user B and returns JWT", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testB@test.com", password: "B123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

describe("Tool routes", () => {
  let token;
  beforeAll(async () => {
    const login = await request(app)
      .post("/api/users/login")
      .send({ username: "testA@test.com", password: "A123456" });
    token = login.body.token;
  });

  test("A creates a new tool 1", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "tool 1")
      .field("price", 10)
      .field("location", "Gothenburg")
      .attach("photo", "tests/assets/spike_test.jpg");
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("tool 1");
  });

  test("A creates a new tool", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Hammer")
      .field("price", 10)
      .field("location", "Gothenburg")
      .attach("photo", "tests/assets/spike_test.jpg");
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Hammer");
  });  

  test("fetches all tools", async () => {
    const res = await request(app).get("/api/tools");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

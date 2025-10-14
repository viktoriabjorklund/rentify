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

// --------------------------------------------------------------

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

// --------------------------------------------------------------

describe("A Logins and creates tools", () => {
  let tokenA;
  beforeAll(async () => {
    const login = await request(app)
      .post("/api/users/login")
      .send({ username: "testA@test.com", password: "A123456" });
    tokenA = login.body.token;
  });

  test("A creates a new tool 1", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "tool 1")
      .field("price", 10)
      .field("location", "Gothenburg")
      .attach("photo", "tests/assets/spike_test.jpg");
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("tool 1");
  });

  test("A creates a new tool 2", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "tool 2")
      .field("price", 10)
      .field("location", "Gothenburg")
      .attach("photo", "tests/assets/spike_test.jpg");
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("tool 2");
  });

  test("A creates a new tool 3", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "tool 3")
      .field("price", 10)
      .field("location", "Gothenburg")
      .attach("photo", "tests/assets/spike_test.jpg");
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("tool 3");
  });

  test("A changes the price on tool 1", async () => {
    const tool = await prisma.tool.findFirst({
      where: { name: "tool 1", user: { username: "testA@test.com" } },
    });

    const res = await request(app)
      .put(`/api/tools/${tool.id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .field("price", 20)
      .field("location", tool.location)
      .attach("photo", "tests/assets/spike_test.jpg");
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(20);
  });

  test("fetch all A's tools", async () => {
    const res = await request(app)
      .get("/api/tools/mytools")
      .set("Authorization", `Bearer ${tokenA}`);
  
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty("userId");
    expect(res.body[0]).toHaveProperty("user");
    expect(res.body[0].user.username).toBe("testA@test.com");
  });
});

// --------------------------------------------------------------
describe("B Logins and requests A's tools", () => {
  let tokenB;

  beforeAll(async () => {
    const login = await request(app)
      .post("/api/users/login")
      .send({ username: "testB@test.com", password: "B123456" });

    tokenB = login.body.token;
    expect(tokenB).toBeDefined();
  });

  test("B fetches all tools (should include A's)", async () => {
    const res = await request(app).get("/api/tools");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("B requests to rent A's first tool", async () => {
    const tools = await prisma.tool.findMany({
      where: { user: { username: "testA@test.com" } },
    });

    expect(tools.length).toBeGreaterThan(0);

    const toolToRequest = tools[0];

    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        toolId: toolToRequest.id,
        startDate: "2025-10-20T00:00:00Z",
        endDate: "2025-10-25T00:00:00Z",
        price: 100,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.tool.id).toBe(toolToRequest.id);
    expect(res.body).toHaveProperty("renterId");
    expect(res.body.pending).toBe(true);

  });

  test("B fetches sent requests", async () => {
    const res = await request(app)
      .get("/api/requests/sent")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("tool");
    expect(res.body[0].tool.user.username).toBe("testA@test.com");
  });
});

// --------------------------------------------------------------
describe("A Logins and accepts request 2, rejects request 3", () => {
  let tokenA;

  beforeAll(async () => {
    const login = await request(app)
      .post("/api/users/login")
      .send({ username: "testA@test.com", password: "A123456" });

    tokenA = login.body.token;
    expect(tokenA).toBeDefined();
  });

  test("A fetches received requests", async () => {
    const res = await request(app)
      .get("/api/requests/received")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    global.receivedRequests = res.body;
  });

  test("A accepts request 2", async () => {
    const requestToAccept = global.receivedRequests[1];
    const res = await request(app)
      .put(`/api/requests/${requestToAccept.id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ accepted: true, pending: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.accepted).toBe(true);
    expect(res.body.pending).toBe(false);
  });

  test("A rejects request 3", async () => {
    const requestToReject = global.receivedRequests[2]; // tredje requesten
    const res = await request(app)
      .put(`/api/requests/${requestToReject.id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ accepted: false, pending: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.accepted).toBe(false);
    expect(res.body.pending).toBe(false);
  });

  test("A fetches received requests again to verify updates", async () => {
    const res = await request(app)
      .get("/api/requests/received")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const updatedReq2 = res.body.find(r => r.id === global.receivedRequests[1].id);
    const updatedReq3 = res.body.find(r => r.id === global.receivedRequests[2].id);

    expect(updatedReq2.accepted).toBe(true);
    expect(updatedReq2.pending).toBe(false);

    expect(updatedReq3.accepted).toBe(false);
    expect(updatedReq3.pending).toBe(false);
  });
});

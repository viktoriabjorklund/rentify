import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/server.js";

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

  test("logs in user B and fetches profile", async () => {
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ username: "testB@test.com", password: "B123456" });
  
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
  
    tokenB = loginRes.body.token;
    idB = loginRes.body.user.id;
  
    const res = await request(app)
      .get(`/api/users/${idB}`)
      .set("Authorization", `Bearer ${tokenB}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username", "testB@test.com");
  });
  

  test("displays userB profile using stored id and token", async () => {
    const res = await request(app)
      .get(`/api/users/${idB}`)
      .set("Authorization", `Bearer ${tokenB}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username", "testB@test.com");
  });
  
});
// --------------------------------------------------------------

describe("X registers and deletes its account", () => {
  let tokenX;
  let idX;

  beforeAll(async () => {
    await request(app)
      .post("/api/users/register")
      .send({ username: "userX@test.com", password: "X123456" });

    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ username: "userX@test.com", password: "X123456" });

    expect(loginRes.statusCode).toBe(200);

    tokenX = loginRes.body.token;
    idX = loginRes.body.user.id;
  });

  test("deletes userX successfully", async () => {
    const res = await request(app)
      .delete(`/api/users/${idX}`)
      .set("Authorization", `Bearer ${tokenX}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted");

    const check = await request(app)
      .get(`/api/users/${idX}`)
      .set("Authorization", `Bearer ${tokenX}`);

    expect(check.statusCode).toBe(404);
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

  test("A updates the price on tool 1", async () => {
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

  test("A fetches one specific tool by id", async () => {
    const tool = await prisma.tool.findFirst({ where: { name: "tool 2" } });
    const res = await request(app)
      .get(`/api/tools/${tool.id}`)
      .set("Authorization", `Bearer ${tokenA}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", tool.id);
    expect(res.body.name).toBe("tool 2");
  });
  

  test("A fetches their tools", async () => {
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
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.tool.id).toBe(toolToRequest.id);
    expect(res.body).toHaveProperty("renterId");
    expect(res.body.pending).toBe(true);

  });

  test("B requests to rent A's second tool", async () => {
    const tools = await prisma.tool.findMany({
      where: { user: { username: "testA@test.com" } },
    });

    expect(tools.length).toBeGreaterThan(0);

    const toolToRequest = tools[1];

    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        toolId: toolToRequest.id,
        startDate: "2025-10-20T00:00:00Z",
        endDate: "2025-10-25T00:00:00Z",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.tool.id).toBe(toolToRequest.id);
    expect(res.body).toHaveProperty("renterId");
    expect(res.body.pending).toBe(true);

  });

  test("B requests to rent A's third tool", async () => {
    const tools = await prisma.tool.findMany({
      where: { user: { username: "testA@test.com" } },
    });

    expect(tools.length).toBeGreaterThan(0);

    const toolToRequest = tools[2];

    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        toolId: toolToRequest.id,
        startDate: "2025-10-20T00:00:00Z",
        endDate: "2025-10-25T00:00:00Z",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.tool.id).toBe(toolToRequest.id);
    expect(res.body).toHaveProperty("renterId");
    expect(res.body.pending).toBe(true);

  });

  test("B requests to rent A's third tool another date", async () => {
    const tools = await prisma.tool.findMany({
      where: { user: { username: "testA@test.com" } },
    });

    expect(tools.length).toBeGreaterThan(0);

    const toolToRequest = tools[2];

    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        toolId: toolToRequest.id,
        startDate: "2025-11-20T00:00:00Z",
        endDate: "2025-11-25T00:00:00Z",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.tool.id).toBe(toolToRequest.id);
    expect(res.body).toHaveProperty("renterId");
    expect(res.body.pending).toBe(true);

  });

  test("B fetches their own request by ID", async () => {
    const allRequests = await request(app)
      .get("/api/requests/sent")
      .set("Authorization", `Bearer ${tokenB}`);
  
    expect(allRequests.statusCode).toBe(200);
    expect(Array.isArray(allRequests.body)).toBe(true);
    expect(allRequests.body.length).toBeGreaterThan(0);
  
    const requestToFetch = allRequests.body[0];
  
    const res = await request(app)
      .get(`/api/requests/${requestToFetch.id}`)
      .set("Authorization", `Bearer ${tokenB}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", requestToFetch.id);
    expect(res.body.tool).toBeDefined();
  });
  
  
  test("B deletes their 4th request", async () => {
    const requests = await prisma.request.findMany({
      where: { renter: { username: "testB@test.com" } },
    });

    const requestToDelete = requests[requests.length - 1];
    expect(requestToDelete).toBeDefined();

    const res = await request(app)
      .delete(`/api/requests/${requestToDelete.id}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("deleted");

    const stillExists = await prisma.request.findUnique({
      where: { id: requestToDelete.id },
    });
    expect(stillExists).toBeNull();
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
    const requestToReject = global.receivedRequests[2];
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

// --------------------------------------------------------------
describe("A deletes tool 1 and B’s requests update accordingly", () => {
  let tokenA, tokenB;

  beforeAll(async () => {
    const loginA = await request(app)
      .post("/api/users/login")
      .send({ username: "testA@test.com", password: "A123456" });
    tokenA = loginA.body.token;

    const loginB = await request(app)
      .post("/api/users/login")
      .send({ username: "testB@test.com", password: "B123456" });
    tokenB = loginB.body.token;

    expect(tokenA).toBeDefined();
    expect(tokenB).toBeDefined();
  });

  test("A deletes their first tool", async () => {
    const tool = await prisma.tool.findFirst({
      where: { name: "tool 1", user: { username: "testA@test.com" } },
    });
    expect(tool).toBeDefined();

    const res = await request(app)
      .delete(`/api/tools/${tool.id}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Tool deleted");
  });

  test("B fetches sent requests (should now be 2 instead of 3)", async () => {
    const res = await request(app)
      .get("/api/requests/sent")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBe(2);

    const deletedTool = await prisma.tool.findFirst({
      where: { name: "tool 1", user: { username: "testA@test.com" } },
    });
    if (deletedTool) {
      const stillHasDeleted = res.body.some(r => r.tool.id === deletedTool.id);
      expect(stillHasDeleted).toBe(false);
    }
  });
});

// --------------------------------------------------------------
describe("B checks accepted/rejected requests and bookings", () => {
  let tokenB;

  beforeAll(async () => {
    const login = await request(app)
      .post("/api/users/login")
      .send({ username: "testB@test.com", password: "B123456" });

    tokenB = login.body.token;
    expect(tokenB).toBeDefined();
  });

  test("B sees one accepted and one rejected request", async () => {
    const res = await request(app)
      .get("/api/requests/sent")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    const accepted = res.body.filter(r => r.accepted === true);
    const rejected = res.body.filter(r => r.accepted === false && r.pending === false);

    expect(accepted.length).toBe(1);
    expect(rejected.length).toBe(1);
  });

  test("B views their rejected request (marks it as viewed)", async () => {
    const requests = await request(app)
      .get("/api/requests/sent")
      .set("Authorization", `Bearer ${tokenB}`);
  
    expect(requests.statusCode).toBe(200);
    expect(Array.isArray(requests.body)).toBe(true);
  
    const rejectedRequest = requests.body.find(
      (r) => r.accepted === false && r.pending === false
    );
    expect(rejectedRequest).toBeDefined();
  
    const res = await request(app)
      .put(`/api/requests/${rejectedRequest.id}/viewed`)
      .set("Authorization", `Bearer ${tokenB}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("viewed", true);
  
    const updated = await prisma.request.findUnique({
      where: { id: rejectedRequest.id },
    });
    expect(updated.viewed).toBe(true);
  });
  

  test("B has one booking created after A accepted request", async () => {
    const res = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("tool");
    expect(res.body[0]).toHaveProperty("renter");
    expect(res.body[0].renter).toHaveProperty("id");
    expect(res.body[0].renter.username).toBe("testB@test.com");
    expect(res.body[0].tool).toHaveProperty("name");
  });
});

// ----------------------------------------------------------------------

// --------------------------------------------------------------
describe("Error handling: invalid login attempts", () => {
  test("fails to log in with wrong username", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "nonexistent@test.com", password: "A123456" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("user not found");
  });

  test("fails to log in with wrong password", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testA@test.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("invalid password");
  });
});

// --------------------------------------------------------------

describe("Error handling: failed attempt to create account", () => {

  test("fails to register with missing fields", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.toLowerCase()).toContain("missing fields");
  });

  test("fails to register with username already taken", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ username: "taken@test.com", password: "A123456" });

    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "taken@test.com", password: "newpassword" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.toLowerCase()).toContain("username already taken");
  });

  test("fails to register with invalid email format", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "invalidemail", password: "A123456" });
  
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.toLowerCase()).toContain("invalid email");
  });

  test("fails to register if password is too short", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "shortpass@test.com", password: "1234" });
  
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.toLowerCase()).toContain("password");
  });

});


// --------------------------------------------------------------
describe("Error handling: unauthorized delete & update attempt", () => {
  let tokenA, tokenB, idB;

  beforeAll(async () => {
    // Skapa två användare (A och B)
    await request(app)
      .post("/api/users/register")
      .send({ username: "unauthA@test.com", password: "A123456" })
      .ok(() => true);

    await request(app)
      .post("/api/users/register")
      .send({ username: "unauthB@test.com", password: "B123456" })
      .ok(() => true);

    const loginA = await request(app)
      .post("/api/users/login")
      .send({ username: "unauthA@test.com", password: "A123456" });
    tokenA = loginA.body.token;

    const loginB = await request(app)
      .post("/api/users/login")
      .send({ username: "unauthB@test.com", password: "B123456" });
    tokenB = loginB.body.token;
    idB = loginB.body.user.id;
  });

  test("fails if user A tries to delete user B", async () => {
    const res = await request(app)
      .delete(`/api/users/${idB}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.toLowerCase()).toContain("forbidden");
  });

  test("fails if user A tries to update user B", async () => {
    const res = await request(app)
      .put(`/api/users/${idB}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        name: "Hacker",
        surname: "McUpdate",
        password: "newPass123"
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.toLowerCase()).toContain("not authorized");
  });
});

// --------------------------------------------------------------

describe("Error handling: creating tools incorrectly", () => {
  let tokenA;

  beforeAll(async () => {
    const login = await request(app)
      .post("/api/users/login")
      .send({ username: "testA@test.com", password: "A123456" });
    tokenA = login.body.token;
    expect(tokenA).toBeDefined();
  });

  test("fails to create tool without photo", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "Broken Tool")
      .field("price", 50)
      .field("location", "Stockholm");
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.toLowerCase()).toContain("photo");
  });

  test("fails to create tool with missing name", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("price", 50)
      .field("location", "Stockholm")
      .attach("photo", "tests/assets/spike_test.jpg");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "name is required");
  });

  test("fails to create tool with invalid price (-10)", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "Zero Tool")
      .field("price", -10)
      .field("location", "Stockholm")
      .attach("photo", "tests/assets/spike_test.jpg");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid price");
  });

  test("fails to create tool with invalid price (text)", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "Weird Tool")
      .field("price", "abc")
      .field("location", "Gothenburg")
      .attach("photo", "tests/assets/spike_test.jpg");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid price");
  });

  test("fails to create tool without location", async () => {
    const res = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "Nameless Tool")
      .field("price", 30)
      .attach("photo", "tests/assets/spike_test.jpg");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Location is required");
  });
});

// --------------------------------------------------------------


describe("Error handling: updating & deleting tools incorrectly", () => {
  let tokenA, tokenB, toolA;

  beforeAll(async () => {
    const loginA = await request(app)
      .post("/api/users/login")
      .send({ username: "testA@test.com", password: "A123456" });
    tokenA = loginA.body.token;

    const loginB = await request(app)
      .post("/api/users/login")
      .send({ username: "testB@test.com", password: "B123456" });
    tokenB = loginB.body.token;

    const createRes = await request(app)
      .post("/api/tools")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "Tool Update Test")
      .field("price", 20)
      .field("location", "Malmö")
      .attach("photo", "tests/assets/spike_test.jpg");

    toolA = createRes.body;
    expect(toolA).toHaveProperty("id");
  });

  test("fails to update non-existing tool", async () => {
    const res = await request(app)
      .put("/api/tools/999999")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "Nonexistent Tool");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Tool not found");
  });

  test("fails to delete non-existing tool", async () => {
    const res = await request(app)
      .delete("/api/tools/999999")
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "Nonexistent Tool");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Tool not found");
  });

  test("fails to delete another user's tool", async () => {
    const res = await request(app)
      .delete(`/api/tools/${toolA.id}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .field("name", "Nonexistent Tool");

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden");
  });

  test("fails to update another user's tool", async () => {
    const res = await request(app)
      .put(`/api/tools/${toolA.id}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .field("price", 500);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden");
  });

  test("fails to update with invalid price", async () => {
    const res = await request(app)
      .put(`/api/tools/${toolA.id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .field("price", "notANumber");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("fails to update with empty name", async () => {
    const res = await request(app)
      .put(`/api/tools/${toolA.id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .field("name", "");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

});

// -------------------------------------------------------------

describe("Error handling: creating requests incorrectly", () => {
  let tokenA, tokenB, toolA;

  beforeAll(async () => {
    const loginA = await request(app)
      .post("/api/users/login")
      .send({ username: "testA@test.com", password: "A123456" });
    tokenA = loginA.body.token;

    const loginB = await request(app)
      .post("/api/users/login")
      .send({ username: "testB@test.com", password: "B123456" });
    tokenB = loginB.body.token;

    const tools = await prisma.tool.findMany({
      where: { user: { username: "testA@test.com" } },
    });
    toolA = tools[0];
  });


  test("fails to create request with missing fields", async () => {
    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ startDate: "2025-10-20", endDate: "2025-10-25" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("toolId");
  });

  test("fails to create request with invalid date format", async () => {
    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        toolId: toolA.id,
        startDate: "not-a-date",
        endDate: "2025-10-25",
      });

      expect([400, 500]).toContain(res.statusCode);
      expect(res.body).toHaveProperty("error");
  });

  test("fails to create request where endDate is before startDate", async () => {
    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        toolId: toolA.id,
        startDate: "2025-10-25",
        endDate: "2025-10-20",
      });

      expect([400, 500]).toContain(res.statusCode);
      expect(res.body).toHaveProperty("error");
  });

  test("fails to create request for non-existing tool", async () => {
    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        toolId: 999999,
        startDate: "2025-10-20",
        endDate: "2025-10-25",
      });

      expect([404, 500]).toContain(res.statusCode);
      expect(res.body).toHaveProperty("error");
  });

  test("fails to create request on own tool", async () => {
    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        toolId: toolA.id,
        startDate: "2025-10-20",
        endDate: "2025-10-25",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch("own tool");
  });


  test("fails to fetch non-existing request by ID", async () => {
    const res = await request(app)
      .get("/api/requests/999999")
      .set("Authorization", `Bearer ${tokenB}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error.toLowerCase()).toContain("request not found");
  });

  test("fails to delete non-existing request", async () => {
    const res = await request(app)
      .delete("/api/requests/999999")
      .set("Authorization", `Bearer ${tokenB}`);

      expect([404, 500]).toContain(res.statusCode);
      expect(res.body).toHaveProperty("error");
  });

  test("fails to delete someone else's request", async () => {
    const newReq = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        toolId: toolA.id,
        startDate: "2025-11-01",
        endDate: "2025-11-05",
      });

    const requestId = newReq.body.id;
    expect(requestId).toBeDefined();

    const res = await request(app)
      .delete(`/api/requests/${requestId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch("Forbidden: not your request");
  });

  test("fails to update non-existing request", async () => {
    const res = await request(app)
      .put("/api/requests/999999")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ pending: false, accepted: true });

      expect([404, 500]).toContain(res.statusCode);
  });

  test("fails to update request without boolean values", async () => {
    const validReq = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        toolId: toolA.id,
        startDate: "2025-11-10",
        endDate: "2025-11-12",
      });

    const requestId = validReq.body.id;
    expect(requestId).toBeDefined();

    const res = await request(app)
      .put(`/api/requests/${requestId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ pending: "yes", accepted: "no" });

    expect([400, 500]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("error");
  });
});

afterAll(async () => {
  await prisma.booking.deleteMany();
  await prisma.request.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect();
});


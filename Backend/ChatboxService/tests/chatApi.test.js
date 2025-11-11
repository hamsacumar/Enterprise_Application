import request from "supertest";
import app from "../index.js";

describe("Chat REST API", () => {
  it("should return 401 if no token", async () => {
    const res = await request(app).get("/api/messages");
    expect(res.status).toBe(401);
  });
});

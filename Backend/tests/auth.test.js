import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.js";

vi.mock("../utils/email.js", () => ({
    sendVerificationEmail: vi.fn(() => Promise.resolve()),
    sendWelcomeEmail: vi.fn(() => Promise.resolve()),
    sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
    sendEmailChangeConfirmation: vi.fn(() => Promise.resolve()),
}));


describe("POST /api/auth/register", () => {
    it("creates a new user and returns 200", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "whateverpassword123",
            });

        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe("test@example.com");
        expect(res.body.user.password).toBeUndefined(); // never leak the hash

        const userInDb = await User.findOne({ email: "test@example.com" });
        expect(userInDb).not.toBeNull();
    });

    it("rejects a duplicate email with 409", async () => {
        await request(app).post("/api/auth/register").send({
            username: "first",
            email: "dupe@example.com",
            password: "password123",
        });

        const res = await request(app).post("/api/auth/register").send({
            username: "second",
            email: "dupe@example.com",
            password: "password123",
        });

        expect(res.status).toBe(409);
    });

    it("rejects a missing password with 400", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "nopassword",
            email: "nopassword@example.com",
        });

        expect(res.status).toBe(400);
    });
});

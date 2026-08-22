import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/user.js";
import Listing from "../models/listing.js";

const signAccessToken = (user) =>
    jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

const makeListing = (sellerId) =>
    Listing.create({
        title: "Test listing",
        description: "A place to live",
        price: 1000,
        propertyType: "apartment",
        bedrooms: 1,
        bathrooms: 1,
        location: { address: "1 Test St", city: "Testville", state: "Test State" },
        postedBy: sellerId,
    });

describe("POST /api/conversations", () => {
    it("starts a conversation with the listing's real seller", async () => {
        const seller = await User.create({ username: "seller", email: "seller@example.com", password: "hashedpw" });
        const buyer = await User.create({ username: "buyer", email: "buyer@example.com", password: "hashedpw" });
        const listing = await makeListing(seller._id);

        const res = await request(app)
            .post("/api/conversations")
            .set("Cookie", [`accessToken=${signAccessToken(buyer)}`])
            .send({ listingId: listing._id });

        expect(res.status).toBe(200);
        const participantIds = res.body.conversation.participants.map(String);
        expect(participantIds).toContain(seller._id.toString());
        expect(participantIds).toContain(buyer._id.toString());
    });

    it("ignores a forged sellerId and uses the listing's real owner instead", async () => {
        const seller = await User.create({ username: "seller2", email: "seller2@example.com", password: "hashedpw" });
        const buyer = await User.create({ username: "buyer2", email: "buyer2@example.com", password: "hashedpw" });
        const stranger = await User.create({ username: "stranger", email: "stranger@example.com", password: "hashedpw" });
        const listing = await makeListing(seller._id);

        const res = await request(app)
            .post("/api/conversations")
            .set("Cookie", [`accessToken=${signAccessToken(buyer)}`])
            .send({ listingId: listing._id, sellerId: stranger._id }); // forged, should be ignored

        expect(res.status).toBe(200);
        const participantIds = res.body.conversation.participants.map(String);
        expect(participantIds).toContain(seller._id.toString());
        expect(participantIds).not.toContain(stranger._id.toString());
    });

    it("rejects starting a conversation with yourself", async () => {
        const seller = await User.create({ username: "seller3", email: "seller3@example.com", password: "hashedpw" });
        const listing = await makeListing(seller._id);

        const res = await request(app)
            .post("/api/conversations")
            .set("Cookie", [`accessToken=${signAccessToken(seller)}`])
            .send({ listingId: listing._id });

        expect(res.status).toBe(400);
    });
});

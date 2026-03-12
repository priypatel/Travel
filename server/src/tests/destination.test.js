import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import mongoose from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import app from "../app.js";
import Destination from "../models/Destination.model.js";
import Place from "../models/Place.model.js";
import Restaurant from "../models/Restaurant.model.js";
import PropertyStay from "../models/PropertyStay.model.js";

dotenv.config();

// ─── Test fixtures ──────────────────────────────────────────────────────────
const sampleDestination = {
  name: "Test City",
  country: "Test Country",
  description: "A beautiful test city for integration tests.",
  bestTime: "June to August",
  heroImage: "https://images.unsplash.com/photo-test",
  tags: ["beach", "culture"],
  coordinates: { lat: 12.34, lng: 56.78 },
};

let destinationId;

// ─── DB lifecycle ────────────────────────────────────────────────────────────
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await Destination.deleteMany({ name: "Test City" });
  await Place.deleteMany({ name: /Test Place/ });
  await Restaurant.deleteMany({ name: /Test Restaurant/ });
  await PropertyStay.deleteMany({ name: /Test Stay/ });
  await mongoose.disconnect();
});

beforeEach(async () => {
  // Ensure clean state: remove any leftover test destination
  await Destination.deleteMany({ name: "Test City" });
  const dest = await Destination.create(sampleDestination);
  destinationId = dest._id.toString();
});

// ─── GET /api/destinations ───────────────────────────────────────────────────
describe("GET /api/destinations", () => {
  it("returns 200 with status:success and an array", async () => {
    const res = await request(app).get("/api/destinations");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.results).toBe("number");
  });

  it("filters by valid month (June)", async () => {
    const res = await request(app).get("/api/destinations?month=June");
    expect(res.status).toBe(200);
    // All returned destinations must have "June" in bestTime (case-insensitive)
    res.body.data.forEach((d) => {
      expect(d.bestTime.toLowerCase()).toContain("june");
    });
  });

  it("returns 400 for an invalid month value", async () => {
    const res = await request(app).get("/api/destinations?month=Julember");
    expect(res.status).toBe(400);
    // validator now consistently returns error details
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].field).toBe("month");
    expect(res.body.errors[0].message).toMatch(
      /month must be a full month name/i,
    );
  });

  it("rejects query strings that would break a regex", async () => {
    // if the validator ever fails we should not reach the DB regex filter
    const res = await request(app).get("/api/destinations?month=(");
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].field).toBe("month");
    expect(res.body.errors[0].message).toMatch(
      /month must be a full month name/i,
    );
  });

  it("returns empty array (not an error) for a valid month with no matches", async () => {
    // "February" should not match "June to August"
    const res = await request(app).get("/api/destinations?month=February");
    expect(res.status).toBe(200);
    // The test destination has "June to August" so it should not appear
    const names = res.body.data.map((d) => d.name);
    expect(names).not.toContain("Test City");
  });

  it("ignores unknown query params (stripUnknown)", async () => {
    const res = await request(app).get("/api/destinations?unknown=foo");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
  });
});

// ─── GET /api/destinations/:id ───────────────────────────────────────────────
describe("GET /api/destinations/:id", () => {
  it("returns 200 with the correct destination", async () => {
    const res = await request(app).get(`/api/destinations/${destinationId}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.name).toBe("Test City");
    expect(res.body.data.country).toBe("Test Country");
    expect(res.body.data).not.toHaveProperty("__v");
  });

  it("returns 404 for a valid but non-existent ObjectId", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/destinations/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Destination not found");
  });

  it("returns 400 or 500 for a malformed id", async () => {
    const res = await request(app).get("/api/destinations/not-an-id");
    expect([400, 500]).toContain(res.status);
  });
});

// ─── GET /api/destinations/:id/places ────────────────────────────────────────
describe("GET /api/destinations/:id/places", () => {
  it("returns 200 with an empty array when no places exist", async () => {
    const res = await request(app).get(
      `/api/destinations/${destinationId}/places`,
    );
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toEqual([]);
    expect(res.body.results).toBe(0);
  });

  it("returns only places belonging to the requested destination", async () => {
    // Create two places for our test destination and one decoy for another
    const decoy = await Destination.create({
      ...sampleDestination,
      name: "Decoy City",
    });
    await Place.create([
      {
        destinationId,
        name: "Test Place A",
        description: "desc",
        category: "Monument",
        image: "http://img.com/a",
      },
      {
        destinationId,
        name: "Test Place B",
        description: "desc",
        category: "Nature",
        image: "http://img.com/b",
      },
      {
        destinationId: decoy._id,
        name: "Test Place Decoy",
        description: "desc",
        category: "Museum",
        image: "http://img.com/c",
      },
    ]);

    const res = await request(app).get(
      `/api/destinations/${destinationId}/places`,
    );
    expect(res.status).toBe(200);
    expect(res.body.results).toBe(2);
    const names = res.body.data.map((p) => p.name);
    expect(names).toContain("Test Place A");
    expect(names).toContain("Test Place B");
    expect(names).not.toContain("Test Place Decoy");

    // Cleanup decoy
    await Destination.findByIdAndDelete(decoy._id);
  });

  it("returns 404 for a non-existent destination", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/destinations/${fakeId}/places`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Destination not found");
  });
});

// ─── GET /api/destinations/:id/restaurants ───────────────────────────────────
describe("GET /api/destinations/:id/restaurants", () => {
  it("returns 200 with restaurants sorted by rating descending", async () => {
    await Restaurant.create([
      {
        destinationId,
        name: "Test Restaurant Low",
        cuisine: "Italian",
        priceLevel: "$",
        rating: 3,
      },
      {
        destinationId,
        name: "Test Restaurant High",
        cuisine: "French",
        priceLevel: "$$$",
        rating: 5,
      },
      {
        destinationId,
        name: "Test Restaurant Mid",
        cuisine: "Thai",
        priceLevel: "$$",
        rating: 4,
      },
    ]);

    const res = await request(app).get(
      `/api/destinations/${destinationId}/restaurants`,
    );
    expect(res.status).toBe(200);
    expect(res.body.results).toBe(3);
    const ratings = res.body.data.map((r) => r.rating);
    expect(ratings).toEqual([5, 4, 3]); // sorted descending
  });

  it("returns 404 for a non-existent destination", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(
      `/api/destinations/${fakeId}/restaurants`,
    );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Destination not found");
  });
});

// ─── GET /api/destinations/:id/stays ─────────────────────────────────────────
describe("GET /api/destinations/:id/stays", () => {
  it("returns 200 with stays sorted by rating descending", async () => {
    await PropertyStay.create([
      {
        destinationId,
        name: "Test Stay Budget",
        priceRange: "$50-100",
        rating: 3,
        location: "City",
      },
      {
        destinationId,
        name: "Test Stay Luxury",
        priceRange: "$500-1000",
        rating: 5,
        location: "Beach",
      },
    ]);

    const res = await request(app).get(
      `/api/destinations/${destinationId}/stays`,
    );
    expect(res.status).toBe(200);
    expect(res.body.results).toBe(2);
    expect(res.body.data[0].rating).toBeGreaterThanOrEqual(
      res.body.data[1].rating,
    );
  });

  it("returns 404 for a non-existent destination", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/destinations/${fakeId}/stays`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Destination not found");
  });
});

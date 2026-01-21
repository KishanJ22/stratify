import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import db from "../../database/db.js";

describe("POST /portfolios", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    it("should create a new portfolio for the user", async () => {
        db.insertInto("auth.user")
            .values({ id: "kjet" } as any)
            .execute();

        const response = await app.inject({
            method: "POST",
            url: "/portfolios",
            headers: {
                Authorization:
                    "Bearer Dev-eyJhbGciOiJFZERTQSIsImtpZCI6IjQ4T0dacTdXM1VPeWEzeDByU1hmNXpoM1dBRlI4MFVMIn0.eyJpYXQiOjE3NjkwMjg3ODEsIm5hbWUiOiJraXNoYW4gamV0aHdhIiwiZW1haWwiOiJraXNoYW5qZXRod2EyMjRAZ21haWwuY29tIiwiZW1haWxWZXJpZmllZCI6ZmFsc2UsImltYWdlIjpudWxsLCJjcmVhdGVkQXQiOiIyMDI2LTAxLTIxVDIwOjUyOjEwLjkxMVoiLCJ1cGRhdGVkQXQiOiIyMDI2LTAxLTIxVDIwOjUyOjEwLjkxMVoiLCJ1c2VybmFtZSI6ImtqZXQiLCJkaXNwbGF5VXNlcm5hbWUiOiJramV0IiwidHdvRmFjdG9yRW5hYmxlZCI6ZmFsc2UsImlkIjoiZDV4Rmk4NHBQSngyWFNWTHg4cVAyOERZUjdjQ2szR2ciLCJzdWIiOiJkNXhGaTg0cFBKeDJYU1ZMeDhxUDI4RFlSN2NDazNHZyIsImV4cCI6MTc2OTAzMjM4MSwiaXNzIjoiaHR0cDovLzEyNy4wLjAuMToyMDAwIiwiYXVkIjoiaHR0cDovLzEyNy4wLjAuMToyMDAwIn0.FylHg8aWUhZK2wPc4P2qsoTpx_hYllCRCx3Dq7VHrgZz0i6hrLwPEKfH7VCoRPYdvsUVn9v5qNxkCxj5AnsiDw",
                Accept: "application/json",
            },
            body: {
                name: "test portfolio",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(201);

        expect(json).toEqual({
            data: {
                success: true,
            },
        });
    });
});

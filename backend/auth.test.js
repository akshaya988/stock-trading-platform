const test = require("node:test");
const assert = require("node:assert/strict");
const { hashPassword, verifyPassword, signAuthToken, verifyAuthToken } = require("./auth");

test("password hashes verify only the original password", async () => {
    const { salt, passwordHash } = await hashPassword("correct horse battery");

    assert.equal(await verifyPassword("correct horse battery", salt, passwordHash), true);
    assert.equal(await verifyPassword("incorrect password", salt, passwordHash), false);
});

test("signed sessions verify, reject tampering, and expire", () => {
    const secret = "test-secret";
    const now = 1_800_000_000_000;
    const token = signAuthToken("user-123", secret, now);

    assert.equal(verifyAuthToken(token, secret, now), "user-123");
    assert.equal(verifyAuthToken(`${token}x`, secret, now), null);
    assert.equal(verifyAuthToken(token, "other-secret", now), null);
    assert.equal(verifyAuthToken(token, secret, now + 24 * 60 * 60 * 1000), null);
});

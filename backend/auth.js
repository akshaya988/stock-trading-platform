const {
    createHmac,
    randomBytes,
    scrypt,
    timingSafeEqual,
} = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);
const passwordKeyLength = 64;
const sessionDurationSeconds = 24 * 60 * 60;

async function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = await scryptAsync(password, salt, passwordKeyLength);
    return { salt, passwordHash: derivedKey.toString("hex") };
}

async function verifyPassword(password, salt, expectedHash) {
    if (typeof password !== "string" || !salt || !expectedHash) {
        return false;
    }
    const derivedKey = await scryptAsync(password, salt, passwordKeyLength);
    const expected = Buffer.from(expectedHash, "hex");
    return expected.length === derivedKey.length &&
        timingSafeEqual(expected, derivedKey);
}

function signAuthToken(userId, secret, now = Date.now()) {
    const payload = Buffer.from(JSON.stringify({
        sub: String(userId),
        exp: Math.floor(now / 1000) + sessionDurationSeconds,
    })).toString("base64url");
    const signature = createHmac("sha256", secret)
        .update(payload)
        .digest("base64url");
    return `${payload}.${signature}`;
}

function verifyAuthToken(token, secret, now = Date.now()) {
    if (typeof token !== "string" || !secret) {
        return null;
    }
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra !== undefined) {
        return null;
    }

    const expectedSignature = createHmac("sha256", secret)
        .update(payload)
        .digest();
    let receivedSignature;
    try {
        receivedSignature = Buffer.from(signature, "base64url");
    } catch {
        return null;
    }
    if (receivedSignature.length !== expectedSignature.length ||
        !timingSafeEqual(receivedSignature, expectedSignature)) {
        return null;
    }

    try {
        const claims = JSON.parse(Buffer.from(payload, "base64url").toString());
        if (typeof claims.sub !== "string" ||
            !claims.sub ||
            typeof claims.exp !== "number" ||
            claims.exp <= Math.floor(now / 1000)) {
            return null;
        }
        return claims.sub;
    } catch {
        return null;
    }
}

module.exports = { hashPassword, verifyPassword, signAuthToken, verifyAuthToken };

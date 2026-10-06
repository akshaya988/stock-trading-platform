require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");

const { HoldingsModel }= require('./model/HoldingsModel');
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const { hashPassword, verifyPassword, signAuthToken, verifyAuthToken } = require("./auth");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const authSecret =
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV === "production"
        ? null
        : crypto.randomBytes(32).toString("hex"));
const allowedOrigins = new Set(
    (process.env.APP_ORIGINS || "http://localhost:3000,http://localhost:3001")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
);

const app = express();

if (!authSecret) {
    throw new Error("AUTH_SECRET must be configured in production.");
}

if (!process.env.AUTH_SECRET) {
    console.warn("AUTH_SECRET is unset; development sessions will end when the server restarts.");
}

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
}));
app.use(bodyParser.json());

const cookieName = "zerodha_session";
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
};

function getSessionToken(req) {
    const cookies = (req.headers.cookie || "").split(";");
    const sessionCookie = cookies.find((cookie) =>
        cookie.trim().startsWith(`${cookieName}=`)
    );
    return sessionCookie ? sessionCookie.trim().slice(cookieName.length + 1) : "";
}

function setSessionCookie(res, userId) {
    const token = signAuthToken(userId, authSecret);
    res.cookie(cookieName, token, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
    });
}

async function requireAuthentication(req, res, next) {
    const userId = verifyAuthToken(getSessionToken(req), authSecret);
    if (!userId) {
        res.status(401).json({ error: "Authentication required." });
        return;
    }

    try {
        const userExists = await UserModel.exists({ _id: userId });
        if (!userExists) {
            res.status(401).json({ error: "Authentication required." });
            return;
        }
        req.userId = userId;
        next();
    } catch (error) {
        next(error);
    }
}

app.post("/auth/signup", async (req, res, next) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const email = typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password = typeof body.password === "string"
        ? body.password
        : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ error: "Enter a valid email address." });
        return;
    }
    if (password.length < 8 || password.length > 128) {
        res.status(400).json({ error: "Password must be between 8 and 128 characters." });
        return;
    }

    try {
        const { salt, passwordHash } = await hashPassword(password);
        const user = await UserModel.create({ email, name, salt, passwordHash });
        setSessionCookie(res, user.id);
        res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ error: "An account with this email already exists." });
            return;
        }
        next(error);
    }
});

app.post("/auth/login", async (req, res, next) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const email = typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password = typeof body.password === "string"
        ? body.password
        : "";
    const user = await UserModel.findOne({ email }).select("+salt +passwordHash");

    if (!user || !(await verifyPassword(password, user.salt, user.passwordHash))) {
        res.status(401).json({ error: "Email or password is incorrect." });
        return;
    }

    setSessionCookie(res, user.id);
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
});

app.get("/auth/me", requireAuthentication, async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId).select("email name");
        if (!user) {
            res.status(401).json({ error: "Authentication required." });
            return;
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        next(error);
    }
});

app.post("/auth/logout", (req, res) => {
    res.clearCookie(cookieName, cookieOptions);
    res.status(204).end();
});

// app.get('/addHoldings', async(req,res)=>{
//     let tempHoldings = [
//   {
//     name: "BHARTIARTL",
//     qty: 2,
//     avg: 538.05,
//     price: 541.15,
//     net: "+0.58%",
//     day: "+2.99%",
//   },
//   {
//     name: "HDFCBANK",
//     qty: 2,
//     avg: 1383.4,
//     price: 1522.35,
//     net: "+10.04%",
//     day: "+0.11%",
//   },
//   {
//     name: "HINDUNILVR",
//     qty: 1,
//     avg: 2335.85,
//     price: 2417.4,
//     net: "+3.49%",
//     day: "+0.21%",
//   },
//   {
//     name: "INFY",
//     qty: 1,
//     avg: 1350.5,
//     price: 1555.45,
//     net: "+15.18%",
//     day: "-1.60%",
//     isLoss: true,
//   },
//   {
//     name: "ITC",
//     qty: 5,
//     avg: 202.0,
//     price: 207.9,
//     net: "+2.92%",
//     day: "+0.80%",
//   },
//   {
//     name: "KPITTECH",
//     qty: 5,
//     avg: 250.3,
//     price: 266.45,
//     net: "+6.45%",
//     day: "+3.54%",
//   },
//   {
//     name: "M&M",
//     qty: 2,
//     avg: 809.9,
//     price: 779.8,
//     net: "-3.72%",
//     day: "-0.01%",
//     isLoss: true,
//   },
//   {
//     name: "RELIANCE",
//     qty: 1,
//     avg: 2193.7,
//     price: 2112.4,
//     net: "-3.71%",
//     day: "+1.44%",
//   },
//   {
//     name: "SBIN",
//     qty: 4,
//     avg: 324.35,
//     price: 430.2,
//     net: "+32.63%",
//     day: "-0.34%",
//     isLoss: true,
//   },
//   {
//     name: "SGBMAY29",
//     qty: 2,
//     avg: 4727.0,
//     price: 4719.0,
//     net: "-0.17%",
//     day: "+0.15%",
//   },
//   {
//     name: "TATAPOWER",
//     qty: 5,
//     avg: 104.2,
//     price: 124.15,
//     net: "+19.15%",
//     day: "-0.24%",
//     isLoss: true,
//   },
//   {
//     name: "TCS",
//     qty: 1,
//     avg: 3041.7,
//     price: 3194.8,
//     net: "+5.03%",
//     day: "-0.25%",
//     isLoss: true,
//   },
//   {
//     name: "WIPRO",
//     qty: 4,
//     avg: 489.3,
//     price: 577.75,
//     net: "+18.08%",
//     day: "+0.32%",
//   },
// ];

// tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//         name: item.name,
//         qty: item.qty,
//         avg: item.avg,
//         price: item.price,
//         net: item.day,
//         day: item.day,
//     });
//     newHolding.save();
// });
// res.send("Done");
// });

// app.get("/addPositions", async (req, res) => {

//     let tempPositions = [
//         {
//             product: "CNC",
//             name: "EVEREADY",
//             qty: 2,
//             avg: 316.27,
//             price: 312.35,
//             net: "+0.58%",
//             day: "-1.24%",
//             isLoss: true,
//         },
//         {
//             product: "CNC",
//             name: "JUBLFOOD",
//             qty: 1,
//             avg: 3124.75,
//             price: 3082.65,
//             net: "+10.04%",
//             day: "-1.35%",
//             isLoss: true,
//         },
//     ];

//     tempPositions.forEach((item) => {

//         let newPosition = new PositionsModel({
//             product: item.product,
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price: item.price,
//             net: item.net,
//             day: item.day,
//             isLoss: item.isLoss,
//         });

//         newPosition.save();
//     });

//     res.send("Done");
// });

app.get('/allHoldings', requireAuthentication, async(req, res, next) => {
    try {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
    } catch (error) {
        next(error);
    }
});

app.get('/allPositions', requireAuthentication, async(req, res, next) => {
    try {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
    } catch (error) {
        next(error);
    }
});

app.post('/newOrder', requireAuthentication, async(req, res, next) => {
    try {
        const newOrder = await OrdersModel.create({
            name: req.body.name,
            qty: req.body.qty,
            price: req.body.price,
            mode: req.body.mode,
        });

        res.status(201).json({ id: newOrder.id, message: "Order saved." });
    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) {
        next(error);
        return;
    }
    res.status(500).json({ error: "An unexpected server error occurred." });
});

// app.get("/deleteHoldings", async (req, res) => {
//     await HoldingsModel.deleteMany({});
//     res.send("Holdings deleted");
// });


mongoose.connect(uri)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`App started on port ${PORT}; database connected.`);
        });
    })
    .catch((error) => {
        console.error("Unable to connect to MongoDB.", error);
        process.exitCode = 1;
    });
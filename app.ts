import express from "express";
import { router as movie } from "./api/movie";
import { router as stars } from "./api/stars";
import { router as creators } from "./api/creators";
import bodyParser from "body-parser";
import cors from "cors";

export const app = express();

app.use(bodyParser.text()); //Text
app.use(bodyParser.json()); //Json
app.use("/movie", movie);
app.use("/stars", stars);
app.use("/creators", creators);

app.use(
    cors({
        origin: "*",
    })
);

// app.use("/", (req, res) => {
//   res.send("Hello World!!!");
// });
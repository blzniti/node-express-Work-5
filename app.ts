import express from "express";
import { router as index } from "./api/index";
import { router as movie } from "./api/movie";
import { router as stars } from "./api/stars";
import { router as person } from "./api/person";
import { router as creators } from "./api/creators";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser.text()); //Text
app.use(bodyParser.json()); //Json
app.use("/", index);
app.use("/movie", movie);
app.use("/stars", stars);
app.use("/creators", creators);

// app.use("/", (req, res) => {
//   res.send("Hello World!!!");
// });
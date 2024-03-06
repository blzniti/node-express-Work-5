import express from "express";
import mysql from "mysql";
import { conn } from "../dbconnect";
import { CreatorsPostRequest } from "../model/CreatorsPostRequest";

export const router = express.Router();

// get ALL /movie/ID
router.get("/", (req, res) => {
  conn.query("select * from Creators", (err, result, fields) => {
    res.json(result);
  });
});

// get by ID /movie/ID
router.get("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query(
    "select * from Creators where Mid = ?",
    [id],
    (err, result, fields) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

// post /Creators
router.post("/", (req, res) => {
  const star: CreatorsPostRequest = req.body;

  let sql =
    "INSERT INTO `Creators` (`Mid`, `Name_C`, `Age_C`, `Image_C`, `Detail_C`) VALUES (?, ?, ?, ?, ?)";
  sql = mysql.format(sql, [star.Mid, star.Name, star.Age, star.Image, star.Detail]);

  conn.query(sql, (err, result) => {
    if (err) {
      console.error("Error inserting data into Creators table:", err);
      res.status(500).json({
        error: "An error occurred while inserting data into the Creators table.",
      });
      return;
    }
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("delete from Creators where Cid = ?", [id], (err, result) => {
     if (err) throw err;
     res
       .status(200)
       .json({ affected_row: result.affectedRows });
  });
});
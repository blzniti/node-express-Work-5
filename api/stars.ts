import express from "express";
import mysql from "mysql";
import { conn } from "../dbconnect";
import { StarsPostRequest } from "../model/StarsPostRequest";

export const router = express.Router();

// get ALL /movie/ID
router.get("/", (req, res) => {
  conn.query("select * from Stars", (err, result, fields) => {
    res.json(result);
  });
});

// get by ID /movie/ID
router.get("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query(
    "select * from Stars where Mid = ?",
    [id],
    (err, result, fields) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

// post /stars
router.post("/", (req, res) => {
  const star: StarsPostRequest = req.body;

  let sql =
    "INSERT INTO `Stars` (`Mid`, `Name_S`, `Age_S`, `Image_S`, `Detail_S`) VALUES (?, ?, ?, ?, ?)";
  sql = mysql.format(sql, [star.Mid, star.Name, star.Age, star.Image, star.Detail]);

  conn.query(sql, (err, result) => {
    if (err) {
      console.error("Error inserting data into Stars table:", err);
      res.status(500).json({
        error: "An error occurred while inserting data into the Stars table.",
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
  conn.query("delete from Stars where Sid = ?", [id], (err, result) => {
     if (err) throw err;
     res
       .status(200)
       .json({ affected_row: result.affectedRows });
  });
});

// get by name ID /stars/search/fields?name=
router.get("/search/fields", (req, res) => {
  conn.query(
    "select * from Stars where (Sid IS NULL OR Sid = ?) OR (Name IS NULL OR Name like ?)",
    [ req.query.id, "%" + req.query.name + "%"],
    (err, result, fields) => {
    if (err) throw err;
      res.json(result);
    }
  );
});
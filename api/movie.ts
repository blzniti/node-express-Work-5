import express from "express";
import mysql from "mysql";
import { conn } from "../dbconnect";
import { MoviePostRequest } from "../model/MoviePostRequest";

export const router = express.Router();

// get ALL /movie/ID
router.get("/", (req, res) => {
  conn.query("select * from Movie", (err, result, fields) => {
    res.json(result);
  });
});

// get by ID /movie/ID
router.get("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query(
    "select * from Movie where Mid = ?",
    [id],
    (err, result, fields) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

// post /movie
router.post("/", (req, res) => {
  const movie: MoviePostRequest = req.body;

  let sql =
    "INSERT INTO `Movie` (`Name`, `Poster`, `Runtime`, `Plot`, `Year`) VALUES (?, ?, ?, ?, ?)";
  sql = mysql.format(sql, [
    movie.Name,
    movie.Poster,
    movie.Runtime,
    movie.Plot,
    movie.Year,
  ]);

  conn.query(sql, (err, result) => {
    if (err) {
      console.error("Error inserting data into Movie table:", err);
      res.status(500).json({
        error: "An error occurred while inserting data into the Movie table.",
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
  conn.query("delete from Movie where Mid = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

// get by name ID
// router.get("/search/fields", (req, res) => {
//   conn.query(
//     "select * from Movie where (Mid IS NULL OR Mid = ?) OR (Name IS NULL OR Name like ?)",
//     [ req.query.id, "%" + req.query.name + "%"],
//     (err, result, fields) => {
//     if (err) throw err;
//       res.json(result);
//     }
//   );
// });

router.get("/search/fields", (req, res) => {
  const { name } = req.query;

  conn.query(`
    SELECT
        Movie.*,
        Stars.*,
        Person.Type AS TypeS,
        Creators.*,
        PersonCreator.Type AS TypeC
    FROM
        Movie
    LEFT JOIN
        Stars ON Movie.Mid = Stars.Mid
    LEFT JOIN
        Creators ON Movie.Mid = Creators.Mid
    LEFT JOIN
        Person ON Stars.Pid_S = Person.Pid
    LEFT JOIN
        Person AS PersonCreator ON Creators.Pid_C = PersonCreator.Pid
    WHERE
        Movie.Name LIKE ?
  `, [`%${name}%`], (err, result, fields) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "An error occurred while executing the SQL query." });
      return;
    }
    res.json(result);
  });
});

// router.get("/search/fields", (req, res) => {
//   const { name } = req.query;

//   conn.query(`
//     SELECT 
//         Movie.*, 
//         GROUP_CONCAT(DISTINCT CONCAT(Stars.Name_S, ' (', Stars.Age_S, ' years, ', Stars.Image_S, ', ', Stars.Detail_S, ')')) AS Stars,
//         GROUP_CONCAT(DISTINCT CONCAT(Creators.Name_C, ' (', Creators.Age_C, ' years, ', Creators.Image_C, ', ', Creators.Detail_C, ')')) AS Creators
//     FROM 
//         Movie
//     LEFT JOIN 
//         Stars ON Movie.Mid = Stars.Mid
//     LEFT JOIN 
//         Creators ON Movie.Mid = Creators.Mid
//     WHERE 
//         Movie.Name LIKE ?
//     GROUP BY
//         Movie.Mid
//   `, [`%${name}%`], (err, result, fields) => {
//     if (err) {
//       console.error("Error executing SQL query:", err);
//       res.status(500).json({ error: "An error occurred while executing the SQL query." });
//       return;
//     }
//     res.json(result);
//   });
// });

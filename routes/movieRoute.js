import { createMovie, deleteMovie, getAllMovies, getMovie, updateMovie } from "../controllers/movieController.js";
import express from "express";
import { singleUpload } from "../middleware/multer.js";
const router = express.Router()

router.post('/new', singleUpload, createMovie)
router.get('/', getAllMovies)

router.route('/:id').get(getMovie).put(singleUpload, updateMovie).delete(deleteMovie)

export default router;
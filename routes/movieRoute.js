import { createMovie, deleteMovie, getAllMovies, getMovie, updateMovie, rateMovie } from "../controllers/movieController.js";
import express from "express";
import { singleUpload } from "../middleware/multer.js";
const router = express.Router()

router.post('/new', singleUpload, createMovie)
router.get('/', getAllMovies)
//rating
router.post('/rate/:id', rateMovie)

router.route('/:id').get(getMovie).put(singleUpload, updateMovie).delete(deleteMovie)

export default router;
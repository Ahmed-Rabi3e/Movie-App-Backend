import { Movie } from "../models/MovieModel.js";

export const createMovie = async (req, res, next) => {
    try {
        const poster = req.file;

        if (!req.body.title || !req.body.describtion || !req.body.publishYear) {
            return res.status(400).send({ msg: 'Enter all Required Fields' })
        }
        if (!poster) {
            return res.status(400).send({ msg: 'Enter Poster Field' })
        }

        const newMovie = {
            title: req.body.title,
            describtion: req.body.describtion,
            publishYear: req.body.publishYear,
            poster: poster.path
        }
        const movie = await Movie.create(newMovie)
        return res.status(201).send(movie)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }

};

export const getAllMovies = async (req, res, next) => {
    try {
        const { title, publishYear, minYear, maxYear, limit = 10, page = 1 } = req.query;

        let query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (publishYear) {
            query.publishYear = publishYear;
        }

        if (minYear || maxYear) {
            query.publishYear = {
                ...(minYear && { $gte: minYear }),
                ...(maxYear && { $lte: maxYear }),
            };
        }

        // Add pagination
        const skip = (page - 1) * limit;
        const movies = await Movie.find(query).limit(Number(limit)).skip(skip);

        const totalMovies = await Movie.countDocuments(query);
        res.status(200).json({
            count: movies.length,
            total: totalMovies,
            currentPage: Number(page),
            totalPages: Math.ceil(totalMovies / limit),
            data: movies,
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }

};

export const getMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id)
        res.status(200).json(movie)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
};

export const updateMovie = async (req, res) => {
    try {
        const poster = req.file;
        if (!req.body.title || !req.body.describtion || !req.body.publishYear) {
            return res.status(400).send({ msg: 'Enter all Required Fields' })
        }
        if (!poster) {
            return res.status(400).send({ msg: 'Enter Poster Field' })
        }
        const { id } = req.params;

        const updateMovie = {
            title: req.body.title,
            describtion: req.body.describtion,
            publishYear: req.body.publishYear,
            poster: poster.path
        }
        const result = await Movie.findByIdAndUpdate(id, updateMovie)
        if (!result) {
            return res.status(404).send({ msg: 'Movie Not Found' })
        }
        return res.status(200).send({ message: 'Movie Updated Succussfully' })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
};

export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Movie.findByIdAndDelete(id)
        if (!result) {
            return res.status(404).send({ msg: 'Movie Not Found' })
        }
        res.status(200).send({ message: 'Movie Deleted Succussfully' })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
};

//user make rating
export const rateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).send({ msg: 'Movie Not Found' })
        }
        movie.rating = rating;
        await movie.save();
        res.status(200).send({ message: 'Movie Rated Succussfully' })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
};
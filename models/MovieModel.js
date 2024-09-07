import mongoose from "mongoose";

const movieSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        describtion: {
            type: String,
            require: true
        },
        publishYear: {
            type: Number,
            require: true
        },
        poster: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 10
        }
    },
    {
        timestamps: true,
    }
)

export const Movie = mongoose.model('Movie', movieSchema)

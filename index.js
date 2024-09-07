import express from "express";
import 'dotenv/config';
import mongoose from "mongoose";
import cors from "cors";
import movieRoute from './routes/movieRoute.js'
import authRoutes from './routes/authRoutes.js'
import bodyParser from "body-parser";

const app = express()

// MiddleWare
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(
    bodyParser.urlencoded({ extended: true, })
);

app.get('/', (req, res) => {
    res.status(200).send('<h1>Movie Store API</h1>')
})


app.use('/movies', movieRoute);
app.use('/auth', authRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('APP CONNECTED TO DB...');
        app.listen(PORT, () => {
            console.log(`Server on http://localhost:${PORT} ...`);
        })
    }).catch((error) => {
        console.log(error);
    })

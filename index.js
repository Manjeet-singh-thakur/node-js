import express from 'express'
const app = express();
import './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js'

app.use(express.json());
app.use('/api/v1', userRoutes);

const port = 5000;
app.listen(port, () => {
    console.log('server is running');
    const error = false;
    if (error) {
        console.log('error running in server', error);
    }
})
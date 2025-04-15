
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

import productRoutes from './routes/productRoutes.js'
import { sql } from './config/db.js'


dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000
const __dirname = path.resolve()

console.log(__dirname);



app.use(express.json())
app.use(cors())
app.use( 
    helmet({
        contentSecurityPolicy: false,
    })
)
app.use(morgan('dev'))

app.use('/api/products', productRoutes)

if (process.env.NODE_ENV === "production") {
  // server our react app
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

 async function initDB() {
    try {
       await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
       ` 
       console.log('Database initialized successfully');
    } catch (error) {
        console.log('Error initDB', error);
    }
 }

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is runing on port ${PORT}`);
    })
})

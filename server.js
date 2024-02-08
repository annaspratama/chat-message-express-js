import express from "express"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const app = express();
dotenv.config();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")))

app.listen(port, () => {console.log(`Server is running on port ${port}.`)});
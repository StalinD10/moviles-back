import app from "./app.js";
import cors from "cors"

app.listen(5000);

app.use(cors());
console.log("Server on port", 5000);
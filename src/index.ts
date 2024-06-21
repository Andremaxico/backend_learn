import { app } from "./app";
import { connectDb } from "./db";

const port = 3030;


const runApp = async () => {
    await connectDb().catch(console.error);

    app.listen(port, () => {
        console.log('Example app listening on port ', port);
    });
}

runApp();
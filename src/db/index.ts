import { MongoClient } from "mongodb";
import { DBType } from "../types";

// export const db: DBType = {
//     pupils: [],
//     schools: [],
//     requestsCount: 0,
// }


// Connection URL
const url = 'mongodb://localhost:27017';

const client = new MongoClient(url);

const connectDb = async () =>{

    let databasesList;

    async function listDatabases(client: MongoClient){
        databasesList = await client.db().admin().listDatabases();
     
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    };

    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

export const db = client.db('startDB');


connectDb().catch(console.error);
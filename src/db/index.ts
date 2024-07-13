import { MongoClient } from "mongodb";
import { DBType, PupilType, UserDBType } from "../types";
import { settingsObj } from "../settings";

// export const db: DBType = {
//     pupils: [],
//     schools: [],
//     requestsCount: 0,
// }


// Connection URL
const url = settingsObj.getSettings().MONGO_URI || 'mongodb://0.0.0.0:27017';

console.log('url', url);

const client = new MongoClient(url);

export const connectDb = async () =>{

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
        await listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } 
    // finally {
    //     await client.close();
    // }
}

export const db = client.db('startDB');
export const pupilsCollection = db.collection<PupilType>('pupils');
export const usersCollection  = db.collection<UserDBType>('users');
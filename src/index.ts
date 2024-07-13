import { app } from "./app";
import { connectDb } from "./db";
import dotenv from 'dotenv';
import { settingsObj } from "./settings";
import { SettingsObjType, SettingsType } from "./types";

const port = 3030;

const runApp = async () => {
    const result = dotenv.config()

    console.log('parsed', result.parsed);

    if (result.error) {
        throw result.error;
    }

    settingsObj.setSettings(result.parsed as SettingsType);

    console.log('settings', settingsObj.getSettings());

    await connectDb().catch(console.error);

    app.listen(port, () => {
        console.log('Example app listening on port ', port);
    });
}

runApp();

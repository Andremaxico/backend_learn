import { app } from "./app";
import { connectDb } from "./db";
import dotenv from 'dotenv';
import { settings } from "./settings";
import { SettingsObjType, SettingsType } from "./types";

const port = 3030;


export const settingsObj: SettingsObjType = {
    _settings: {},
    getSettings() {
        return this._settings;
    },
    setSettings(data: SettingsType) {
        this._settings = data;
    }
}

const runApp = async () => {
    const result = dotenv.config()

    if (result.error) {
        throw result.error
    }

    settingsObj.setSettings(result.parsed as SettingsType);

    console.log(result.parsed)
    await connectDb().catch(console.error);

    app.listen(port, () => {
        console.log('Example app listening on port ', port);
    });
}

runApp();
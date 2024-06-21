import { db, pupilsCollection } from "../db";
import { PupilType } from "../types";

export const pupilsRepository = {
    async findPupilsByName(name: string | null): Promise<PupilType[]> {
        const foundPupils = await pupilsCollection.find(name ? {name: {$regexp: name}} : {}).toArray();

        return foundPupils;
    },

    async findPupilById(id: number): Promise<PupilType | null> {
        const foundPupil = await pupilsCollection.findOne({id});
        return foundPupil;
    },  

    async createPupil(name: string): Promise<PupilType> {
        const newPupil: PupilType = {
            id: new Date().getTime(),
            name: name,
            positive: true,
        }
    
        pupilsCollection.insertOne(newPupil);

        return newPupil;
    },

    async removePupil(id: number): Promise<boolean> {
        const result = await pupilsCollection.deleteOne({id});

        return result.deletedCount === 1;
    },

    async updatePupil(id: number, name: string): Promise<boolean> {
        const newPupilData: PupilType = {
            id,
            name: name,
            positive: true,
        }

        const result = await pupilsCollection.updateOne({id}, {$set: newPupilData});

        return result.acknowledged;
    },

    async removeAllPupils() {
        const result = await pupilsCollection.deleteMany({});

        return true;
    }
}
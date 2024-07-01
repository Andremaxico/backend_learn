import { db, pupilsCollection } from "../db";
import { PupilType } from "../types";

export const pupilsRepository = {

    async findPupilsByName(name: string | null): Promise<PupilType[]> {
        const foundPupilsData = await pupilsCollection.find(name ? {name: {$regexp: name}} : {}).toArray();

        return foundPupilsData;
    },

    async findPupilById(id: number): Promise<PupilType | null> {
        const foundPupilData = await pupilsCollection.findOne({id});
        return foundPupilData;
    },  

    async createPupil(newPupilData: PupilType): Promise<PupilType> {
        pupilsCollection.insertOne(newPupilData);

        return newPupilData;
    },

    async removePupil(id: number): Promise<boolean> {
        const result = await pupilsCollection.deleteOne({id});

        return result.deletedCount === 1;
    },

    async updatePupil(updatedPupilData: PupilType): Promise<boolean> {
        const id = updatedPupilData.id;
        const result = await pupilsCollection.updateOne({id}, {$set: updatedPupilData});

        return result.acknowledged;
    },

    async removeAllPupils() {
        const result = await pupilsCollection.deleteMany({});

        return true;
    }
}
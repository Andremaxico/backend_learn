import { db } from "../db";
import { PupilType } from "../types";

export const pupilsRepository = {
    async findPupilsByName(name: string | null): Promise<PupilType[]> {
        let foundPupils = db.collection('pupils');

        console.log('found Pupils', foundPupils);

        if(name && foundPupils. > 0) {
            foundPupils = foundPupils.filter(pupil => pupil.name.indexOf(name) > -1)
        }

        console.log('pupils found', foundPupils);

        return foundPupils;
    },

    async findPupilById(id: number): Promise<PupilType | null> {
        const foundPupil = db.pupils.find(pupil => pupil.id === id) || null;
        return foundPupil;
    },  

    async createPupil(name: string): Promise<PupilType> {
        const newPupil: PupilType = {
            id: new Date().getTime(),
            name: name,
            positive: true,
        }
    
        db.pupils.push(newPupil);

        return newPupil;
    },

    async removePupil(id: number): Promise<boolean> {
        const beforeDelLength = db.pupils.length;

        db.pupils = db.pupils.filter(pupil => pupil.id !== id);

        return db.pupils.length < beforeDelLength;
    },

    async updatePupil(id: number, name: string): Promise<boolean> {
        const updatingPupil = db.pupils.find(pupil => pupil.id === id);

        if(!updatingPupil) {
            return false;
        }

        const updatingIdx = db.pupils.indexOf(updatingPupil);

        if(updatingIdx < 0) {
            return false;
        }

        const newPupilData: PupilType = {
            id,
            name: name,
            positive: true,
        }

        db.pupils[updatingIdx] = {...newPupilData};

        return true;
    },

    removeAllPupils() {
        db.pupils = [];

        return true;
    }
}
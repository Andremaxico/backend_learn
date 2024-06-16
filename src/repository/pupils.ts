import { db } from "../db";
import { PupilType } from "../types";

export const pupilsRepository = {
    findPupilsByName(name: string | null): PupilType[] {
        let foundPupils = db.pupils;

        if(name && foundPupils.length > 0) {
            foundPupils = foundPupils.filter(pupil => pupil.name.indexOf(name) > -1)
        }

        console.log('pupils found', foundPupils);

        return foundPupils;
    },

    findPupilById(id: number): PupilType | null {
        const foundPupil = db.pupils.find(pupil => pupil.id === id) || null;
        return foundPupil;
    },  

    createPupil(name: string): PupilType {
        const newPupil: PupilType = {
            id: new Date().getTime(),
            name: name,
            positive: true,
        }
    
        db.pupils.push(newPupil);

        return newPupil;
    },

    removePupil(id: number): boolean {
        const beforeDelLength = db.pupils.length;

        db.pupils = db.pupils.filter(pupil => pupil.id !== id);

        return db.pupils.length < beforeDelLength;
    },

    updatePupil(id: number, name: string): boolean {
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
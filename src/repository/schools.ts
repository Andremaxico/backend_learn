import { db } from "../db"

export const schoolsRepository = {
    /**
     * use with get request
     */
    findAllBooks(name: string | null): string[] {
        let foundBooks: string[] | null = db.schools;

        if(name) {
            foundBooks = foundBooks.filter(sName => sName.indexOf(name) > -1);
        }

        return foundBooks;
    },


}
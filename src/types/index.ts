import { Request } from "express";

export type RequestWithBody<T> = Request<{}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;


export type DBType = {
    pupils: PupilType[],
    schools: string[],
    requestsCount: number,
}

export type PupilType = {
    name: string, 
    id: number,
    positive: boolean,
}

export type UserDBType = {
    passwordHash: string,
    id: string,
    username: string,
    email: string,
    createdAt: Date,
}
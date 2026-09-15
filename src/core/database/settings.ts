import { generateRandomID, getCurrentDate } from "@/shared/lib";
import { database } from "./instance";
import { ProjectDocument } from "@/shared/types/database";
import { PouchSettingsDb } from "./types";

const createOrUpdateDoc = async (project: T) => {
    const newProject: PouchSettingsDb<T> = {
        _id: generateRandomID(),
        type: "settings",
        createdAt: getCurrentDate(),
        modifiedAt: getCurrentDate(),
        ...project,
    };
    return await database.put(newProject);
};

const getAllDoc = async () =>
    (await database.find({ selector: { type: "settings" } })).docs as ProjectDocument[];

const deleteDoc = async (id: string) => {
    try {
        const doc = await database.get(id);
        database.remove(doc);
    } catch (error) {
        console.error(error);
    }
};

export const projectService = {
    createOrUpdateDoc: createOrUpdateDoc,
    getAllDoc,
    deleteDoc,
};

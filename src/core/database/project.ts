import { generateRandomID, getCurrentDate } from "@/shared/lib";
import { database } from "./instance";
import { Project, ProjectDocument } from "@/shared/types/database";
import { PouchProjectDb } from "./types";

const createDoc = async (project: Project) => {
    const newProject: PouchProjectDb = {
        _id: generateRandomID(),
        type: "project",
        createdAt: getCurrentDate(),
        modifiedAt: getCurrentDate(),
        ...project,
    };
    return await database.put(newProject);
};

const getAllDoc = async () =>
    (await database.find({ selector: { type: "project" } })).docs as ProjectDocument[];

const deleteDoc = async (id: string) => {
    try {
        const doc = await database.get(id);
        database.remove(doc);
    } catch (error) {
        console.error(error);
    }
};

export const projectService = {
    createDoc,
    getAllDoc,
    deleteDoc,
};

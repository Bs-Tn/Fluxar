import { database } from "@/database/instance";
import { generateRandomID, getCurrentDate } from "@/lib";
import { PouchProjectDb, Project, ProjectDocument } from "@/types/database";

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

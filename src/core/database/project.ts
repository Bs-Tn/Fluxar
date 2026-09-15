import { generateRandomID, getCurrentDate } from "@/shared/lib";
import { database } from "./instance";
import { Project, ProjectDocument } from "@/shared/types/database";
import { PouchProjectDb } from "./types";

const createOrUpdateDoc = async (project: Project) => {
    const newProject: PouchProjectDb = {
        _id: generateRandomID(),
        type: "project",
        createdAt: getCurrentDate(),
        modifiedAt: getCurrentDate(),
        ...project,
    };
    return await database.put(newProject);
};

const getAllDoc = async (): Promise<ProjectDocument[]> => {
    const result = await database.find({
        selector: { type: "project" },
    });
    return result.docs as ProjectDocument[];
};

const deleteDoc = async (id: string) => {
    try {
        const doc = await database.get(id);
        database.remove(doc);
    } catch (error) {
        console.error(error);
    }
};

export const projectService = {
    createOrUpdateDoc,
    getAllDoc,
    deleteDoc,
};

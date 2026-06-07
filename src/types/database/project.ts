import { database } from "@/database/instance";
import { PouchProjectDb, Project } from "@/database/project";
import { generateRandomID, getCurrentDate } from "@/lib";

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

const getAll = async () => await database.find({ selector: { type: "project" } });

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
    getAll,
    deleteDoc,
};

import { generateRandomID, getCurrentDate } from "@/shared/lib";
import { Tag, TagDocument } from "@/shared/types/database";
import { PouchTagDb } from "./types";
import { database } from "./instance";

const createDoc = async (tag: Tag) => {
    const newTag: PouchTagDb = {
        _id: generateRandomID(),
        type: "tag",
        createdAt: getCurrentDate(),
        modifiedAt: getCurrentDate(),
        ...tag,
    };
    return await database.put(newTag);
};

const getAllDoc = async () =>
    (await database.find({ selector: { type: "tag" } })).docs as TagDocument[];

const deleteDoc = async (id: string) => {
    try {
        const doc = await database.get(id);
        database.remove(doc);
    } catch (error) {
        console.error(error);
    }
};

export const tagService = {
    createDoc,
    getAllDoc,
    deleteDoc,
};

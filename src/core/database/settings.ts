import { generateRandomID, getCurrentDate } from "@/shared/lib";
import { database } from "./instance";
import { Setting, SettingDocument, SettingName, SettingParent } from "@/shared/types/database";
import { PouchSettingsDb } from "./types";

const createOrUpdateDoc = async <K extends SettingName>(
    setting: Setting<K>
): Promise<PouchDB.Core.Response> => {
    const newSetting: PouchSettingsDb<SettingName> = {
        _id: generateRandomID(),
        type: "setting",
        createdAt: getCurrentDate(),
        modifiedAt: getCurrentDate(),
        ...setting,
    };
    return await database.put(newSetting);
};

const updateDoc = async (newSetting: SettingDocument): Promise<PouchDB.Core.Response | void> => {
    try {
        const doc = await database.get(newSetting._id);
        const updatedDoc = {
            ...doc,
            ...newSetting,
        };
        return await database.put(updatedDoc);
    } catch (error) {
        console.error("Erreur:", error);
    }
};

const getAllDoc = async (): Promise<SettingDocument[]> => {
    const result = await database.find({
        selector: { type: "setting" },
    });
    return result.docs as SettingDocument[];
};

const deleteDoc = async (id: string): Promise<void> => {
    try {
        const doc = await database.get(id);
        database.remove(doc);
    } catch (error) {
        console.error(error);
    }
};

const findDoc = (
    settingParent: SettingParent,
    settingName: SettingName,
    settings: SettingDocument[]
): SettingDocument | undefined =>
    settings.find((s) => s.parent === settingParent && s.name === settingName);

export const settingService = {
    createOrUpdateDoc,
    updateDoc,
    getAllDoc,
    deleteDoc,
    findDoc,
};

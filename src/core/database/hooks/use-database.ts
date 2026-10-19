import { Documents } from "@/shared/types/common";
import { useCallback, useEffect, useState } from "react";
import { projectService } from "../project";
import { tagService } from "../tag";
import { database } from "../instance";
import { settingService } from "../settings";
import { AnyPouchDoc, PouchBackupDb } from "../types";
import { writeTextFile } from "@tauri-apps/plugin-fs";

const KEY_BY_TYPE = {
    project: "projectDocuments",
    tag: "tagDocuments",
    setting: "settingDocuments",
} as const;

const useDatabase = () => {
    const [databaseDocs, setDatabaseDocs] = useState<Documents>({
        projectDocuments: [],
        tagDocuments: [],
        settingDocuments: [],
    });

    const fetchDocs = async (cancelled: boolean): Promise<void> => {
        const [projects, tags, settings] = await Promise.all([
            projectService.getAllDoc(),
            tagService.getAllDoc(),
            settingService.getAllDoc(),
        ]);
        if (cancelled) return;

        setDatabaseDocs({
            projectDocuments: projects,
            tagDocuments: tags,
            settingDocuments: settings,
        });
    };

    /**
     * Applies a PouchDB change (creation, update, or deletion)
     * to the local `databaseDocs` state.
     *
     * Documents without a known `type` are ignored.
     *
     * @param change - Change detected by PouchDB's `.changes()` feed.
     */
    const applyChange = useCallback(
        (change: PouchDB.Core.ChangesResponseChange<AnyPouchDoc>): Documents | null => {
            const doc = change.doc;

            // Ignore if no type
            if (!doc?.type || !KEY_BY_TYPE[doc.type]) return null;

            const key = KEY_BY_TYPE[doc.type];

            let updatedDocs: Documents = {
                projectDocuments: [],
                tagDocuments: [],
                settingDocuments: [],
            };

            setDatabaseDocs((prev) => {
                const list = prev[key];
                const index = list.findIndex((d) => d._id === doc._id);

                let nextList: AnyPouchDoc[];
                if (change.deleted) {
                    nextList = index >= 0 ? list.filter((d) => d._id !== doc._id) : list;
                } else if (index >= 0) {
                    nextList = [...list];
                    nextList[index] = doc;
                } else {
                    nextList = [...list, doc];
                }

                updatedDocs = { ...prev, [key]: nextList };
                return { ...prev, [key]: nextList };
            });
            return updatedDocs;
        },
        []
    );

    const scheduleJsonSync = useCallback(async (docs: Documents | null) => {
        if (!docs) return;

        try {
            const settingDocuments = docs.settingDocuments;

            if (settingDocuments.length === 0) return;
            const backupSetting = settingService.findDoc("general", "backup", settingDocuments);

            const backupFilePath = backupSetting?.value;
            if (!backupFilePath) return;

            setTimeout(async () => {
                const backupData = await getBackupData();
                await writeTextFile(backupFilePath, JSON.stringify(backupData, null, 2));
            }, 500);
        } catch (error) {
            console.error("[useDatabase]: An error occured during sync, ", error);
        }
    }, []);

    // Update locally on every event change & sync with local JSON file
    const syncJsonOnDbEvent = (): PouchDB.Core.Changes<AnyPouchDoc> | null =>
        database
            .changes({ since: "now", live: true, include_docs: true })
            .on("change", async (change) => {
                const updatedDocs = applyChange(change);
                await scheduleJsonSync(updatedDocs);
            })
            .on("error", (error) =>
                console.error("[useDatabase]: An error occured during changes or sync, ", error)
            );

    useEffect(() => {
        let cancelled = false;
        let changes: PouchDB.Core.Changes<AnyPouchDoc> | null = null;

        const onStart = async () => {
            try {
                await fetchDocs(cancelled);
                changes = syncJsonOnDbEvent();
            } catch (error) {
                console.error(error);
            }
        };

        void onStart();

        return () => {
            cancelled = true;
            void changes?.cancel();
        };
    }, []);

    const getBackupData = async (): Promise<PouchBackupDb> => {
        const result = await database.allDocs({
            include_docs: true,
            attachments: true,
        });

        return {
            db_name: database.name,
            exported_at: new Date().toISOString(),
            docs: result.rows.map((row) => row.doc),
        };
    };

    const saveToDatabase = async <T, R>(document: T, save: (doc: T) => Promise<R>): Promise<R> => {
        return await save(document);
    };

    const synchronizeData = async (rawData: string): Promise<boolean> => {
        try {
            const backupData: PouchBackupDb = JSON.parse(rawData);

            if (!backupData.docs || backupData.docs.length === 0) return false;

            // Remove undefined value
            const validDocs = backupData.docs.filter(
                (doc): doc is PouchDB.Core.ExistingDocument<any> => doc !== undefined
            );

            await database.bulkDocs(validDocs);

            return true;
        } catch (error) {
            console.error("An error occured to synchronized the data.", error);
            return false;
        }
    };

    return {
        projects: databaseDocs.projectDocuments,
        tags: databaseDocs.tagDocuments,
        settings: databaseDocs.settingDocuments,
        getBackupData,
        saveToDatabase,
        synchronizeData,
    };
};

export { useDatabase };

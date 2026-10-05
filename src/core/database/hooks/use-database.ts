import { Documents } from "@/shared/types/common";
import { useEffect, useState } from "react";
import { projectService } from "../project";
import { tagService } from "../tag";
import { database, realTimeChanges } from "../instance";
import { settingService } from "../settings";
import { PouchBackupDb } from "../types";

const useDatabase = () => {
    const [databaseDocs, setDatabaseDocs] = useState<Documents>({
        projectDocuments: [],
        tagDocuments: [],
        settingDocuments: [],
    });

    const fetchAllDocs = async () => {
        try {
            const [projects, tags, settings] = await Promise.all([
                projectService.getAllDoc(),
                tagService.getAllDoc(),
                settingService.getAllDoc(),
            ]);

            setDatabaseDocs({
                projectDocuments: projects,
                tagDocuments: tags,
                settingDocuments: settings,
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAllDocs();

        const changes = realTimeChanges(fetchAllDocs);

        return () => changes.cancel();
    }, []);

    const getBackupData = async (): Promise<PouchBackupDb> => {
        const result = await database.allDocs({
            include_docs: true,
            attachments: true, // inclure les pièces jointes si besoin
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

    const synchronizeData = (rawData: string): boolean => {
        try {
            const backupData: PouchBackupDb = JSON.parse(rawData);

            if (!backupData.docs || backupData.docs.length === 0) return false;

            // Remove undefined value, empty object and revision(_rev) value
            const cleanDocs = backupData.docs
                .filter(
                    (doc): doc is PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> =>
                        doc !== undefined && Object.keys(doc).length > 0
                )
                .map(({ _rev, ...rest }) => rest);

            database.bulkDocs(cleanDocs);

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

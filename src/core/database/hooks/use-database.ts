import { Documents } from "@/shared/types/common";
import { useEffect, useState } from "react";
import { projectService } from "../project";
import { tagService } from "../tag";
import { realTimeChanges } from "../instance";
import { settingService } from "../settings";

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

    const saveToDatabase = async <T, R>(document: T, save: (doc: T) => Promise<R>): Promise<R> => {
        return await save(document);
    };
    return {
        projects: databaseDocs.projectDocuments,
        tags: databaseDocs.tagDocuments,
        settings: databaseDocs.settingDocuments,
        saveToDatabase,
    };
};

export { useDatabase };

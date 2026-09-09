import { Documents } from "@/shared/types/common";
import { useEffect, useState } from "react";
import { projectService } from "../project";
import { tagService } from "../tag";
import { realTimeChanges } from "../instance";

const useDatabase = () => {
    const [databaseDocs, setDatabaseDocs] = useState<Documents>({
        projectDocuments: [],
        tagDocuments: [],
    });

    const fetchAllDocs = async () => {
        try {
            const [projects, tags] = await Promise.all([
                projectService.getAllDoc(),
                tagService.getAllDoc(),
            ]);

            setDatabaseDocs({
                projectDocuments: projects,
                tagDocuments: tags,
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

    return {
        projects: databaseDocs.projectDocuments,
        tags: databaseDocs.tagDocuments,
    };
};

export { useDatabase };

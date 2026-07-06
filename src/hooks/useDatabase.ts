import { realTimeChanges } from "@/database/instance";
import { projectService } from "@/database/project";
import { tagService } from "@/database/tag";
import { Documents } from "@/types/common";
import { useEffect, useState } from "react";

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

import { Fragment, useContext, useEffect, useState } from "react";
import { RootContextType } from "@/types/context";
import { RootContext } from "@/App";

import { ProjectDocument } from "@/types/database";
import { ProjectSection } from "./project/project-section";
import { ProjectCategory } from "@/types/common";
import { useTranslation } from "react-i18next";

export const PATH_PROJECT = {
    FRONT: "FRONT",
    API: "API",
    PACKAGE: "PACKAGE",
} as const;

export type PathProjectType = keyof typeof PATH_PROJECT;

const Dashboard = () => {
    const { t } = useTranslation();
    const { projectDocuments, selectedProjectCategory } = useContext<RootContextType>(RootContext);

    const [projectCategory, setProjectCategory] = useState<string | undefined>(undefined);

    const [selectedProjectList, setSelectedProjectList] = useState<ProjectDocument[]>([]);

    // Filter projects depends on the categories and set the category's name
    const filteredProject = () => {
        switch (selectedProjectCategory) {
            case ProjectCategory.ALL:
                setSelectedProjectList(projectDocuments);
                break;
            case ProjectCategory.FRONTEND:
                setSelectedProjectList(projectDocuments.filter((p) => p.category === "Frontend"));
                setProjectCategory(t("shared.categories.frontend"));
                break;

            case ProjectCategory.API:
                setSelectedProjectList(projectDocuments.filter((p) => p.category === "Api"));
                setProjectCategory(t("shared.categories.api"));
                break;

            case ProjectCategory.PACKAGE:
                setSelectedProjectList(projectDocuments.filter((p) => p.category === "Package"));
                setProjectCategory(t("shared.categories.package"));
                break;

            case ProjectCategory.OTHER:
                setSelectedProjectList(projectDocuments.filter((p) => p.category === "Other"));
                setProjectCategory(t("shared.categories.other"));
                break;
        }
    };

    useEffect(() => {
        if (projectDocuments && projectDocuments.length > 0) {
            filteredProject();
        }
    }, [projectDocuments, selectedProjectCategory]);

    return (
        <>
            {selectedProjectCategory === ProjectCategory.ALL ? (
                <Fragment>
                    <ProjectSection
                        projectCategory={t("shared.categories.all")}
                        projects={selectedProjectList}
                    />
                </Fragment>
            ) : (
                <ProjectSection projectCategory={projectCategory} projects={selectedProjectList} />
            )}
        </>
    );
};

export { Dashboard };

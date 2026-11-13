import { Fragment, useContext, useEffect, useState } from "react";
import { RootContextType } from "@/shared/types/context";
import { RootContext } from "@/App";

import { ProjectCategory, ProjectCategoryType } from "@/shared/types/common";
import { useTranslation } from "react-i18next";
import { ProjectDocument } from "@/shared/types/database";
import { ProjectSection } from "./project-section";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { Filter, FilterOption } from "@/shared/components/ui/filter";
import { TypographyH2, TypographyH3 } from "@/shared/components/ui/typography";
import { cn } from "@/shared/lib/utils";
import { AnimatedButton } from "@/shared/components/ui/animated/button";

export const PATH_PROJECT = {
    FRONT: "FRONT",
    API: "API",
    PACKAGE: "PACKAGE",
} as const;

export type PathProjectType = keyof typeof PATH_PROJECT;

const Dashboard = () => {
    const { t } = useTranslation();
    const {
        documents: { projectDocuments },
        selectedProjectCategory,
    } = useContext<RootContextType>(RootContext);

    const [categoryName, setCategoryName] = useState<string | undefined>(
        t("shared.categories.all-projects")
    );

    const [selectedProjectList, setSelectedProjectList] = useState<ProjectDocument[]>([]);
    const [categorySelected, setCategorySelected] = useState<ProjectCategoryType>(
        ProjectCategory.ALL
    );

    const STATUS_FILTERS = [
        { value: ProjectCategory.ALL, label: t("shared.categories.all") },
        { value: ProjectCategory.FRONTEND, label: t("shared.categories.frontend") },
        { value: ProjectCategory.API, label: t("shared.categories.api") },
        { value: ProjectCategory.PACKAGE, label: t("shared.categories.package") },
        { value: ProjectCategory.OTHER, label: t("shared.categories.other") },
    ] as const satisfies readonly FilterOption<ProjectCategoryType>[];

    // Filter projects depends on the categories and set the category's name
    const filteredProject = () => {
        switch (categorySelected) {
            case ProjectCategory.ALL:
                setSelectedProjectList(projectDocuments);
                setCategoryName(t("shared.categories.all-projects"));

                break;
            case ProjectCategory.FRONTEND:
                setSelectedProjectList(projectDocuments.filter((p) => p.category === "Frontend"));
                setCategoryName(t("shared.categories.frontend"));
                break;

            case ProjectCategory.API:
                setSelectedProjectList(projectDocuments.filter((p) => p.category === "Api"));
                setCategoryName(t("shared.categories.api"));
                break;

            case ProjectCategory.PACKAGE:
                setSelectedProjectList(projectDocuments.filter((p) => p.category === "Package"));
                setCategoryName(t("shared.categories.package"));
                break;

            case ProjectCategory.OTHER:
                setSelectedProjectList(projectDocuments.filter((p) => p.category === "Other"));
                setCategoryName(t("shared.categories.other"));
                break;
        }
    };

    useEffect(() => {
        if (projectDocuments && projectDocuments.length > 0) {
            filteredProject();
        }
    }, [projectDocuments, categorySelected]);

    if (!selectedProjectList) return;

    return (
        <>
            {/* {selectedProjectCategory === ProjectCategory.ALL ? (
                <Fragment>
                    <ProjectSection
                        projectCategory={t("shared.categories.all")}
                        projects={selectedProjectList}
                    />
                </Fragment>
            ) : (
                <ProjectSection projectCategory={projectCategory} projects={selectedProjectList} />
            )} */}
            <div className="w-full flex flex-col gap-2">
                <div className="w-full flex gap-4">
                    <Filter
                        options={STATUS_FILTERS}
                        value={categorySelected}
                        onChange={setCategorySelected}
                        ariaLabel="Filtrer les projets par catégorie"
                    />
                </div>
                <Separator />
                <div className="flex justify-between">
                    <TypographyH3 className="text-md text-accent uppercase font-bold">
                        {categoryName}
                    </TypographyH3>
                    <AnimatedButton direction="left" size="lg" />
                </div>

                {/* DATA LIST */}
                <ul className="w-full flex flex-col gap-4">
                    {selectedProjectList.map((p: ProjectDocument) => {
                        const firstLetter = p.name.split("")[0].toUpperCase();

                        return (
                            <li
                                className={cn(
                                    "group flex items-center h-14 overflow-hidden px-4",
                                    "hover: cursor-pointer"
                                )}
                            >
                                <div
                                    aria-hidden="true"
                                    className={cn(
                                        " min-w-20 flex-none text-center pointer-events-none select-none font-bold",
                                        "text-[50px] -rotate-5"
                                    )}
                                    style={{
                                        color: "transparent",
                                        WebkitTextStroke: `1px color-mix(in srgb, ${p.tag?.color} 30%, transparent)`,
                                    }}
                                >
                                    {firstLetter}
                                </div>

                                <div className="flex-1">
                                    <div className=" font-medium">{p.name}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export { Dashboard };

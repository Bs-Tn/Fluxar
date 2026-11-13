import { ProjectDocument, SettingDocument, TagDocument } from "./database";

export const ProjectCategory = {
    ALL: "all",
    FRONTEND: "frontend",
    API: "api",
    PACKAGE: "package",
    OTHER: "other",
} as const;

export type ProjectCategoryType = "all" | "frontend" | "api" | "package" | "other";

export type Documents = {
    projectDocuments: ProjectDocument[];
    tagDocuments: TagDocument[];
    settingDocuments: SettingDocument[];
};

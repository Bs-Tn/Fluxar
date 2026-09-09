import { ProjectDocument, TagDocument } from "./database";

export const ProjectCategory = {
    ALL: "all",
    FRONTEND: "frontend",
    API: "api",
    PACKAGE: "package",
    OTHER: "other",
} as const;

export type Documents = {
    projectDocuments: ProjectDocument[];
    tagDocuments: TagDocument[];
};

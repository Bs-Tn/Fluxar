import { ProjectCategory } from "@/shared/types/form";

export type Project = {
    name: string;
    category: ProjectCategory;
    tag?: Tag;
    directoryPath: string;
    urlEndpoint?: string;
};

export type Tag = {
    name: string;
    color?: string;
};

export type ProjectDocument = Project & {
    _id: string;
    _rev?: string;
    type: "project";
};

export type TagDocument = Tag & {
    _id: string;
    _rev?: string;
    type: "tag";
};

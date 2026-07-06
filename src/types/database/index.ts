import { ProjectCategory } from "@/types/form";

type PouchDbType = "project" | "tag";

export type Project = {
    name: string;
    category: ProjectCategory;
    tag?: Tag;
    directoryPath: string;
    urlEndpoint?: string;
};

export type ProjectDocument = Project & {
    _id: string;
    _rev?: string;
    type: "project";
};

export type PouchProjectDb = PouchDB.Core.IdMeta &
    Project & {
        type: PouchDbType;
        createdAt: string;
        modifiedAt: string;
    };

export type Tag = {
    name: string;
    color?: string;
};

export type TagDocument = Tag & {
    _id: string;
    _rev?: string;
    type: "tag";
};

export type PouchTagDb = PouchDB.Core.IdMeta &
    Tag & {
        type: PouchDbType;
        createdAt: string;
        modifiedAt: string;
    };

import { ProjectCategory } from "@/types/form";

type PouchDbType = "project" | "tag";

export type Project = {
    name: string;
    category: ProjectCategory;
    tag?: string;
    directoryPath: string;
    urlEndpoint?: string;
};

export type PouchProjectDb = PouchDB.Core.IdMeta &
    Project & {
        type: PouchDbType;
        createdAt: string;
        modifiedAt: string;
    };

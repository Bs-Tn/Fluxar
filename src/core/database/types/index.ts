import { Project, Tag } from "@/shared/types/database";

type PouchDbType = "project" | "tag";

export type PouchProjectDb = PouchDB.Core.IdMeta &
    Project & {
        type: PouchDbType;
        createdAt: string;
        modifiedAt: string;
    };

export type PouchTagDb = PouchDB.Core.IdMeta &
    Tag & {
        type: PouchDbType;
        createdAt: string;
        modifiedAt: string;
    };

import { Project, Tag } from "@/shared/types/database";

type PouchDbType = "project" | "tag" | "settings";

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

export type PouchSettingsDb<T> = PouchDB.Core.IdMeta &
    T & {
        type: PouchDbType;
        createdAt: string;
        modifiedAt: string;
    };

export type PouchBackupDb = {
    db_name: string;
    exported_at: string;
    docs: (PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> | undefined)[];
};

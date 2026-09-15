import { Project, Setting, SettingName, Tag } from "@/shared/types/database";

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

export type PouchSettingsDb<K extends SettingName = SettingName> = K extends SettingName
    ? PouchDB.Core.IdMeta &
          Setting<K> & {
              type: "setting";
              createdAt: string;
              modifiedAt: string;
          }
    : never;

export type PouchBackupDb = {
    db_name: string;
    exported_at: string;
    docs: (PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> | undefined)[];
};

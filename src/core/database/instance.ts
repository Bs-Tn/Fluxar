import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";
import { PouchBackupDb } from "./types";

PouchDB.plugin(PouchFind);

const database = new PouchDB("fluxar");

// Create an index once
await database.createIndex({
    index: { fields: ["type"] },
});

const realTimeChanges = (callback: () => void) =>
    database
        .changes({
            since: "now",
            live: true,
            include_docs: true,
        })
        .on("change", () => callback());

const getBackupData = async (): Promise<PouchBackupDb> => {
    const result = await database.allDocs({
        include_docs: true,
        attachments: true, // inclure les pièces jointes si besoin
    });

    return {
        db_name: database.name,
        exported_at: new Date().toISOString(),
        docs: result.rows.map((row) => row.doc),
    };
};

const synchronizeData = (rawData: string): boolean => {
    const backupData: PouchBackupDb = JSON.parse(rawData);

    if (!backupData.docs || backupData.docs.length === 0) return false;

    // Remove undefined value, empty object and revision(_rev) value
    const cleanDocs = backupData.docs
        .filter(
            (doc): doc is PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> =>
                doc !== undefined && Object.keys(doc).length > 0
        )
        .map(({ _rev, ...rest }) => rest);

    database.bulkDocs(cleanDocs);

    return true;
};

export { database, getBackupData, synchronizeData, realTimeChanges };

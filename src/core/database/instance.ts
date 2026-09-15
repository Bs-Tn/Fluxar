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
    const resultDbData = await database.allDocs({
        include_docs: true,
        attachments: true, // inclure les pièces jointes si besoin
    });

    return {
        db_name: database.name,
        exported_at: new Date().toISOString(),
        docs: resultDbData.rows.map((row) => row.doc),
    };
};

export { database, getBackupData, realTimeChanges };

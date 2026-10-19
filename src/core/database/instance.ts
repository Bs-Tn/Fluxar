import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";
import { AnyPouchDoc } from "./types";

PouchDB.plugin(PouchFind);

const database = new PouchDB<AnyPouchDoc>("fluxar");

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

export { database, realTimeChanges };

import PouchDb from "pouchdb";
import { PouchProjectDb } from "./project";
// import { generateRandomID, getCurrentDate } from "@/lib";

// export class DatabaseService {
//     private static instance: DatabaseService;
//     private db: PouchDB.Database<T>;

//     constructor() {
//         this.db = new PouchDb<T>("fluxar", {
//             auto_compaction: true,
//         });
//     }

//     static getInstance(): DatabaseService {
//         if (!DatabaseService.instance) {
//             DatabaseService.instance = new DatabaseService();
//         }
//         return DatabaseService.instance;
//     }

//     /**
//      * Gets all Series
//      * @returns All Series
//      */
//     public async getAllSeries(): Promise<PouchDB.Core.AllDocsResponse<Series>> {
//         return await this.db.allDocs({ include_docs: true });
//     }

//     /**
//      * Get a specific Series with its id
//      * @param id Series's id
//      * @returns The specific document corresponding to the id
//      */
//     public async getSeriesById(id: string): Promise<Series> {
//         try {
//             const response = await this.db.get<Series>(id);
//             return response;
//         } catch (error) {
//             console.error(
//                 `An error occured trying to fecth a Series with id : ${id}`
//             );
//             throw error;
//         }
//     }

//     /**
//      * Create a Series
//      * @param series Series object
//      * @returns Series's id `string`
//      */
//     public async createSeries(series: Series): Promise<string> {
//         try {
//             series._id = generateRandomID(); // TODO Overkill to generate a random UUID rather than give a simple string ??
//             series.creationDate = getCurrentDate();
//             series.modificationDate = getCurrentDate();
//             const response = await this.db.put(series);
//             return response.id;
//         } catch (error) {
//             console.error("An error occured trying to save the Series");
//             throw error;
//         }
//     }

//     /**
//      * Update a Series
//      * @param series Series object
//      * @returns Series's id `string`
//      */
//     public async updateSeries(series: Series): Promise<void> {
//         try {
//             await this.db.put(series);
//         } catch (error) {
//             console.error("An error occured trying to update the Series");
//             throw error;
//         }
//     }

//     /**
//      * Delete a Series
//      * @param id Series's id
//      */
//     public async deleteSeriesById(id: string): Promise<void> {
//         const Series = await this.db.get(id);
//         this.db.remove(Series._id, Series._rev);
//     }
// }

const database = new PouchDb<PouchProjectDb>("fluxar");

export { database };

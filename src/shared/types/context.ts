import { Dispatch, SetStateAction } from "react";
import { ProjectDocument, TagDocument } from "./database";

export type RootContextType = {
    projectDocuments: ProjectDocument[];
    tagDocuments: TagDocument[];
    selectedProjectCategory: string;
    setSelectedProjectCategory: Dispatch<SetStateAction<string>>;
};

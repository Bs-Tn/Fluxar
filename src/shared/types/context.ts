import { Dispatch, SetStateAction } from "react";
import { Documents } from "./common";

export type RootContextType = {
    documents: Documents;
    selectedProjectCategory: string;
    setSelectedProjectCategory: Dispatch<SetStateAction<string>>;
};

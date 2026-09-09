import { Dispatch, SetStateAction } from "react";

export type SettingsDialogProps = {
    open: boolean;
    onOpen: Dispatch<SetStateAction<boolean>>;
};

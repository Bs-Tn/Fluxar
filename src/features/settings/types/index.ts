import { Dispatch, SetStateAction } from "react";

export type SettingsDialogProps = {
    open: boolean;
    onOpen: Dispatch<SetStateAction<boolean>>;
};

export type MenuItems = {
    id: string;
    title: string;
    isActive: boolean;
    component: React.LazyExoticComponent<React.ComponentType<any>>;
};

export type MenuOptions = {
    title: string;
    icon?: React.ElementType;
    isActive: boolean;
    items: Array<MenuItems>;
};

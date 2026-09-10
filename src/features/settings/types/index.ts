import { Dispatch, SetStateAction } from "react";

export type SettingsDialogProps = {
    open: boolean;
    onOpen: Dispatch<SetStateAction<boolean>>;
};

export type MenuItemsProps = {
    id: string;
    title: string;
    isActive: boolean;
    component: React.LazyExoticComponent<React.ComponentType<any>>;
};

export type MenuSectionProps = {
    title: string;
    icon?: React.ElementType;
    isActive: boolean;
    items: Array<MenuItemsProps>;
};

import { ProjectCategory } from "@/shared/types/form";

// ========== COMMON ==========

type BaseDocFields = {
    _id: string;
    _rev?: string;
};

// =============================

// ========== PROJECT ==========

export type Project = {
    name: string;
    category: ProjectCategory;
    tag?: Tag;
    directoryPath: string;
    urlEndpoint?: string;
};

// =============================

export type ProjectDocument = BaseDocFields &
    Project & {
        type: "project";
    };

// ========== TAG ==========

export type Tag = {
    name: string;
    color?: string;
};

export type TagDocument = BaseDocFields &
    Tag & {
        type: "tag";
    };

// =============================

// ========== SETTING ==========

export type SettingParent = "general";

export type SettingsRegistry = {
    language: string;
    backup: string;
};

export type SettingName = keyof SettingsRegistry;

export type Setting<K extends SettingName = SettingName> = K extends SettingName
    ? { parent: SettingParent; name: K; value: SettingsRegistry[K] }
    : never;

export type SettingDocument = BaseDocFields &
    Setting & {
        type: "setting";
    };

// =============================

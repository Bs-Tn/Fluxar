import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

import { useDatabase } from "@/core/database/hooks/use-database";

import { Button } from "@/shared/components/ui/button";
import { TypographyDescription, TypographyH3 } from "@/shared/components/ui/typography";
import { Separator } from "@/shared/components/ui/separator";
import { Field, FieldLabel } from "@/shared/components/ui/field";

import { settingService } from "@/core/database/settings";
import { Setting, SettingDocument } from "@/shared/types/database";

import { FolderOpen } from "lucide-react";
import { getBackupData } from "@/core/database/instance";

type Props = {
    backupSetting: SettingDocument | undefined;
};

const Backup = ({ backupSetting }: Props) => {
    const { t } = useTranslation();
    const { saveToDatabase } = useDatabase();

    const [selectedPath, setSelectedPath] = useState<string | undefined>(
        backupSetting?.value ?? undefined
    );

    const createOrUpdateBackupSetting = async (filePath: string) => {
        if (backupSetting) {
            const setting: SettingDocument = { ...backupSetting, value: filePath };
            await saveToDatabase<SettingDocument, PouchDB.Core.Response | void>(
                setting,
                settingService.updateDoc
            );
        } else {
            const setting: Setting<"backup"> = {
                parent: "general",
                name: "backup",
                value: filePath,
            };
            await saveToDatabase<Setting<"backup">, PouchDB.Core.Response>(
                setting,
                settingService.createOrUpdateDoc
            );
        }
    };

    const handleFilePath = async () => {
        try {
            const backupData = await getBackupData();

            const filePath: string | null = await save({
                filters: [
                    {
                        name: "fluxar",
                        extensions: ["json"],
                    },
                ],
            });

            // File path canceled by the user
            if (!filePath) return;

            await writeTextFile(filePath, JSON.stringify(backupData, null, 2));

            await createOrUpdateBackupSetting(filePath);

            setSelectedPath(filePath);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
        }
    };

    return (
        <Fragment>
            <div className="w-full flex gap-5 items-center">
                <Separator className="flex w-8" />
                <TypographyH3>{t("features.settings.data.backup.title")}</TypographyH3>
                <Separator className="flex flex-1" />
            </div>
            <div className="flex flex-col gap-5">
                <TypographyDescription>
                    {t("features.settings.data.backup.desc")}
                </TypographyDescription>
                <Field>
                    <div className="flex flex-col xl:flex-row xl:justify-end xl:items-center">
                        <Button type="button" className="h-10 w-40" onClick={handleFilePath}>
                            <FolderOpen />
                            {t("shared.browse")}
                        </Button>
                    </div>

                    {selectedPath && (
                        <div className="flex">
                            <FieldLabel className="flex-1">
                                {t("features.settings.data.backup.label")}
                            </FieldLabel>
                            <p className="font-bold">{selectedPath}</p>
                        </div>
                    )}
                </Field>
            </div>
        </Fragment>
    );
};

export { Backup };

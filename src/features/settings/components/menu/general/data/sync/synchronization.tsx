import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { FolderSync } from "lucide-react";

import { readTextFile } from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";

import { useDatabase } from "@/core/database/hooks/use-database";
import { settingService } from "@/core/database/settings";

import { Setting, SettingDocument } from "@/shared/types/database";

import { Button } from "@/shared/components/ui/button";
import { TypographyDescription, TypographyH3 } from "@/shared/components/ui/typography";
import { Separator } from "@/shared/components/ui/separator";
import { Field, FieldLabel } from "@/shared/components/ui/field";

type Props = {
    backupSetting: SettingDocument | undefined;
};

const Synchronization = ({ backupSetting }: Props) => {
    const { t } = useTranslation();
    const { synchronizeData, saveToDatabase } = useDatabase();

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const backupPath = backupSetting?.value;

    const onSync = async (filePath: string): Promise<boolean> => {
        try {
            const rawData = await readTextFile(filePath);
            const isSyncCompleted = synchronizeData(rawData);
            return isSyncCompleted;
        } catch (error) {
            return false;
        }
    };

    // TODO DO two function; one to create and one to update
    const onFallbackSync = async <T extends SettingDocument | Setting<"backup">>(
        setting: T,
        callback: (setting: T) => Promise<PouchDB.Core.Response | void>
    ) => {
        try {
            // Select the backup file
            const filePath: string | null = await open();
            if (filePath) {
                const isSyncCompleted = await onSync(filePath);

                if (!isSyncCompleted) {
                    setErrorMessage(t("features.settings.data.sync.error.invalid-file"));
                    return;
                }

                // Saving the file into the database
                const updateSetting: T = { ...setting, value: filePath };

                await saveToDatabase<T, PouchDB.Core.Response | void>(updateSetting, callback);
            } else console.error("An error occured to synchronized the data.");
        } catch (error) {
            throw error;
        }
    };

    const handleSyncDatabaseWithFile = async () => {
        try {
            setErrorMessage(undefined);

            if (backupPath) {
                const isSyncCompleted = await onSync(backupPath);
                if (!isSyncCompleted) {
                    const setting: SettingDocument = { ...backupSetting! };
                    onFallbackSync<SettingDocument>(setting, settingService.updateDoc);
                }
            } else {
                const setting: Setting<"backup"> = {
                    parent: "general",
                    name: "backup",
                    value: "",
                };
                onFallbackSync<Setting<"backup">>(setting, settingService.createDoc);
            }
        } catch (error) {
            console.error("An error occured to synchronized the data.");
            setErrorMessage(t("features.settings.data.sync.error.common"));
        }
    };

    return (
        <Fragment>
            <div className="w-full flex gap-5 items-center">
                <Separator className="flex w-8" />

                <TypographyH3>{t("features.settings.data.sync.title")}</TypographyH3>
                <Separator className="flex flex-1" />
            </div>
            <div className="flex flex-col gap-5">
                <TypographyDescription>
                    {t("features.settings.data.sync.desc")}
                </TypographyDescription>
                <Field>
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center">
                        <FieldLabel className="flex-1">
                            {t("features.settings.data.sync.label")}
                        </FieldLabel>
                        <Button
                            type="button"
                            className="h-10 w-40"
                            onClick={handleSyncDatabaseWithFile}
                        >
                            <FolderSync />
                            {t("features.settings.data.sync.action")}
                        </Button>
                    </div>
                    {errorMessage && (
                        <p className="text-destructive font-semibold">{errorMessage}</p>
                    )}
                </Field>
            </div>
        </Fragment>
    );
};

export { Synchronization };

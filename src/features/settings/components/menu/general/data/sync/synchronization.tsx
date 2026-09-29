import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { readTextFile } from "@tauri-apps/plugin-fs";

import { Button } from "@/shared/components/ui/button";
import { TypographyDescription, TypographyH3 } from "@/shared/components/ui/typography";
import { Separator } from "@/shared/components/ui/separator";
import { Field, FieldLabel } from "@/shared/components/ui/field";

import { FolderSync } from "lucide-react";
import { synchronizeData } from "@/core/database/instance";

type Props = {
    backupPath: string | undefined;
};

const Synchronization = ({ backupPath }: Props) => {
    const { t } = useTranslation();

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const handleSyncDatabaseWithFile = async () => {
        try {
            // TODO if setting value not found open a dialog to let the user choose the file
            setErrorMessage(undefined);
            if (backupPath) {
                const rawData = await readTextFile(backupPath);

                const isSyncCompleted = synchronizeData(rawData);

                if (!isSyncCompleted)
                    setErrorMessage(t("features.settings.data.sync.error.common"));
            }
        } catch (error) {
            console.error(error);
            return null;
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

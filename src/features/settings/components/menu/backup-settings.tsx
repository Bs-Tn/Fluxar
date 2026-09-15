import { useState } from "react";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { useTranslation } from "react-i18next";
import { FolderOpen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { getBackupData } from "@/core/database/instance";

const BackupSettings = () => {
    const { t } = useTranslation();

    const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);

    const handleFilePath = async () => {
        try {
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

            setSelectedPath(filePath);

            const backupData = await getBackupData();

            await writeTextFile(filePath, JSON.stringify(backupData, null, 2));
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <p>{t("features.settings.backup.desc")}</p>
            <Field>
                <FieldLabel>Emplacement du fichier de sauvegarde</FieldLabel>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center ">
                    <Button type="button" className="h-10 w-full xl:w-1/3" onClick={handleFilePath}>
                        <FolderOpen />
                        Parcourir
                    </Button>
                    {selectedPath && <p className="font-bold">{selectedPath}</p>}
                </div>
            </Field>
        </div>
    );
};

export default BackupSettings;

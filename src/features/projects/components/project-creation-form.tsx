import { Fragment } from "react";
import { Field, FieldDescription, FieldFormError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir, DirEntry } from "@tauri-apps/plugin-fs";
import { ProjectCategory, ProjectCategoryValue } from "@/shared/types/form";
import { Button } from "@/shared/components/ui/button";
import { FolderOpen } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import TagField from "./tag-field";

const ProjectCreationForm = () => {
    const { t } = useTranslation();
    const { control, watch, setError, setValue } = useFormContext();

    const selectedTypeValue = watch("category") as ProjectCategory;

    const checkFile = (entry: DirEntry) => {
        switch (selectedTypeValue) {
            // Check if package json exist in the directory
            case ProjectCategoryValue.FRONTEND:
            case ProjectCategoryValue.PACKAGE:
                if (entry.name.toLowerCase() === "package.json") {
                    setValue("directoryPath", entry.name);
                    return true;
                }
                break;
            case ProjectCategoryValue.API:
                return true;
        }
        return false;
    };

    const checkDirectory = async (dirPath: string): Promise<boolean> => {
        try {
            const entries = await readDir(dirPath);

            let containFile = false;
            for (const entry of entries) {
                if (entry.isFile) {
                    containFile = checkFile(entry);
                    if (containFile) return true;
                }
            }
        } catch (err) {
            console.error("Error occurs when reading the directory or file :", err);
        }
        return false;
    };

    const handleSelectProjectPath = async (onChange: (value: string) => void): Promise<void> => {
        const folderPath: string | null = await open({
            multiple: false,
            directory: true, // Only folder can be selected
        });

        if (folderPath && typeof folderPath === "string") {
            const hasFile = await checkDirectory(folderPath);

            if (!hasFile) {
                switch (selectedTypeValue) {
                    case ProjectCategoryValue.FRONTEND:
                    case ProjectCategoryValue.PACKAGE:
                        setError("directoryPath", {
                            message:
                                "Vérifier que le dossier contient bien le fichier package.json",
                            type: "custom",
                        });
                        break;
                    case ProjectCategoryValue.API:
                        setError("directoryPath", {
                            message:
                                "Vérifier que le dossier contient bien le fichier de la solution",
                            type: "custom",
                        });
                        break;
                }
            }

            onChange(folderPath);
        }
    };

    return (
        <Fragment>
            <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{t("form.project.category.label")}</FieldLabel>
                        <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger id="category" aria-invalid={fieldState.invalid}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent alignItemWithTrigger={false}>
                                <SelectItem value={ProjectCategoryValue.FRONTEND}>
                                    Frontend
                                </SelectItem>
                                <SelectItem value={ProjectCategoryValue.API}>Api</SelectItem>
                                <SelectItem value={ProjectCategoryValue.PACKAGE}>
                                    Package
                                </SelectItem>
                                <SelectItem value={ProjectCategoryValue.OTHER}>
                                    {t("form.project.category.other")}
                                </SelectItem>
                            </SelectContent>
                            {fieldState.error && (
                                <p className="text-destructive">{fieldState.error.message}</p>
                            )}
                        </Select>
                    </Field>
                )}
            />

            <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{t("form.project.name.label")}</FieldLabel>
                        <Input
                            {...field}
                            id="name"
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                        />
                        <FieldFormError error={fieldState.error} />
                    </Field>
                )}
            />

            <Controller
                name="directoryPath"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="flex flex-col gap-4">
                            <FieldLabel>{t("form.project.directory-path.label")}</FieldLabel>
                            <FieldDescription>
                                {selectedTypeValue === ProjectCategoryValue.API ? (
                                    <Trans
                                        i18nKey="form.project.directory-path.desc-api"
                                        components={{ bold: <strong /> }}
                                    />
                                ) : (
                                    <Trans
                                        i18nKey="form.project.directory-path.desc-other"
                                        components={{ bold: <strong /> }}
                                    />
                                )}
                            </FieldDescription>
                            {field.value && <p>{field.value}</p>}
                            {fieldState.error && <p>{fieldState.error.message}</p>}
                            <Button
                                type="button"
                                className="h-10"
                                onClick={() => handleSelectProjectPath(field.onChange)}
                            >
                                <FolderOpen />
                                Parcourir
                            </Button>
                        </div>
                    </Field>
                )}
            />

            <Controller
                name="tag"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{t("form.project.tag.label")}</FieldLabel>
                        <TagField field={field} fieldState={fieldState} />
                    </Field>
                )}
            />

            {selectedTypeValue === ProjectCategoryValue.API && (
                <Controller
                    name="urlEndpoint"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>{t("form.project.url-endpoint.label")}</FieldLabel>
                            <FieldDescription>
                                {t("form.project.url-endpoint.desc")}
                            </FieldDescription>
                            <Input
                                {...field}
                                id="urlEndpoint"
                                placeholder={t("form.project.url-endpoint.placeholder")}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            <FieldFormError error={fieldState.error} />
                        </Field>
                    )}
                />
            )}
        </Fragment>
    );
};

export { ProjectCreationForm };

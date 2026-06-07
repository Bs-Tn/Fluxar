import { Fragment, useState } from "react";
import { Field, FieldDescription, FieldFormError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir, DirEntry } from "@tauri-apps/plugin-fs";
import { ProjectCategory, ProjectCategoryValue } from "@/types/form";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

const ProjectCreationForm = () => {
    const { t } = useTranslation();
    const { control, watch, setError, setValue } = useFormContext();
    const { errors } = useFormState();
    console.log(errors);
    const [showTagInput, setShowTagInput] = useState<boolean>(false);
    const [tagName, setTagName] = useState<string>("");

    const selectedTypeValue = watch("category") as ProjectCategory;

    const mockTags = ["Gestion Client", "Convergence", "Other"];

    const onSelectChange = (value: string, onChange: (value: string) => void) => {
        setTagName("");
        setShowTagInput(false);
        onChange(value);
    };

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
                break;
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
                        <FieldLabel htmlFor="category">
                            {t("form.project.category.label")}
                        </FieldLabel>
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
                        <FieldLabel htmlFor="name">{t("form.project.name.label")}</FieldLabel>
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
                            <FieldLabel htmlFor="path">
                                {t("form.project.directory-path.label")}
                            </FieldLabel>
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
                        <FieldLabel htmlFor="tag">{t("form.project.tag.label")}</FieldLabel>
                        <div className="flex gap-4">
                            <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={(value) => onSelectChange(value, field.onChange)}
                            >
                                <SelectTrigger
                                    id="tag"
                                    className="w-full"
                                    aria-invalid={fieldState.invalid}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent alignItemWithTrigger={false}>
                                    <div className="max-h-32 overflow-y-auto">
                                        {mockTags.map((tag) => (
                                            <SelectItem key={tag} value={tag}>
                                                {tag}
                                            </SelectItem>
                                        ))}
                                    </div>
                                    <SelectSeparator />
                                    {showTagInput ? (
                                        <div className="flex gap-2 p-3">
                                            <Input
                                                type="text"
                                                placeholder={t("form.project.tag.placeholder")}
                                                className="w-1/2"
                                                maxLength={20}
                                                value={tagName}
                                                onClick={(e) => e.stopPropagation()}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                onChange={(event) => {
                                                    setTagName(event.target.value);
                                                }}
                                            />
                                            <Button
                                                onClick={() => {
                                                    console.log("TODO SAVE Tag name : " + tagName);

                                                    setShowTagInput(false);
                                                }}
                                            >
                                                {t("shared.confirm")}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowTagInput(!showTagInput)}
                                            >
                                                {t("shared.cancel")}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start rounded-none"
                                            onClick={() => setShowTagInput(!showTagInput)}
                                        >
                                            {t("form.project.tag.creation")}
                                        </Button>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </Field>
                )}
            />

            {selectedTypeValue === ProjectCategoryValue.API && (
                <Controller
                    name="urlEndpoint"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="urlEndpoint">
                                {t("form.project.url-endpoint.label")}
                            </FieldLabel>
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

import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { generateRandomHexColor } from "@/shared/lib";

import { RootContext } from "@/App";
import { RootContextType } from "@/shared/types/context";
import { Tag } from "@/shared/types/database";
import { tagService } from "@/core/database/tag";

type Props = {
    field: ControllerRenderProps;
    fieldState: ControllerFieldState;
};

const TagField = ({ field, fieldState }: Props) => {
    const { t } = useTranslation();
    const { tagDocuments } = useContext<RootContextType>(RootContext);

    const formatTags: Tag[] = tagDocuments.map((td) => ({ name: td.name, color: td.color }));

    const [tags, setTags] = useState<Tag[]>(formatTags);

    const [showTagInput, setShowTagInput] = useState<boolean>(false);
    const [tagName, setTagName] = useState<string>("");

    const resetTag = () => {
        setTagName("");
        setShowTagInput(false);
    };

    const onSelectChange = (value: string, onChange: (value: Tag) => void) => {
        resetTag();
        const selectedTag = tags.find((t) => t.name === value);
        onChange(selectedTag!);
    };

    const onTagCreation = async () => {
        try {
            const tagColor = generateRandomHexColor();

            await tagService.createDoc({
                name: tagName,
                color: tagColor,
            });

            resetTag();
            setTags((prevState) => [...prevState, { name: tagName, color: tagColor }]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Select
            name={field.name}
            value={field.value}
            onValueChange={(value) => onSelectChange(value, field.onChange)}
        >
            <SelectTrigger id="tag" className="w-full" aria-invalid={fieldState.invalid}>
                <SelectValue>
                    {field.value && (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-6 rounded-sm"
                                style={{ backgroundColor: field.value.color }}
                            />
                            <span>{field.value.name}</span>
                        </div>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
                <div className="max-h-32 overflow-y-auto">
                    {tags.map((tag) => (
                        <SelectItem key={tag.name} value={tag.name}>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-8 h-6 rounded-sm"
                                    style={{ backgroundColor: tag.color }}
                                ></div>
                                <p> {tag.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </div>
                <SelectSeparator />
                {showTagInput ? (
                    <div className="flex gap-2 p-3">
                        <Input
                            type="text"
                            placeholder={t("features.projects.form.project.tag.placeholder")}
                            className="w-1/2"
                            maxLength={20}
                            value={tagName}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onChange={(event) => {
                                setTagName(event.target.value);
                            }}
                        />
                        <Button onClick={() => onTagCreation()}>{t("shared.confirm")}</Button>
                        <Button variant="outline" onClick={resetTag}>
                            {t("shared.cancel")}
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        className="w-full justify-start rounded-none"
                        onClick={() => setShowTagInput(!showTagInput)}
                    >
                        {t("features.projects.form.project.tag.creation")}
                    </Button>
                )}
            </SelectContent>
        </Select>
    );
};

export default TagField;

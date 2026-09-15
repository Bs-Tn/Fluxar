import { Field, FieldLabel } from "@/shared/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSettings = () => {
    const { t, i18n } = useTranslation();

    const [selectedLanguage, setSelectedLanguage] = useState<string>(
        t(`features.settings.language.name.${i18n.language}`)
    );
    const handleLanguageChange = (value: string | null): void => {
        if (value) {
            setSelectedLanguage(t(`features.settings.language.name.${value}`));
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <p>{t("features.settings.language.desc")}</p>
            <Field className="w-full xl:w-1/3">
                <FieldLabel>{t("features.settings.language.title")}</FieldLabel>
                <Select
                    name="language"
                    value={selectedLanguage}
                    onValueChange={handleLanguageChange}
                    disabled={true}
                >
                    <SelectTrigger id="language">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                        <SelectItem value="fr">
                            {t("features.settings.language.name.fr")}
                        </SelectItem>
                    </SelectContent>
                    {/* TODO Handle errors */}
                </Select>
            </Field>
        </div>
    );
};

export default LanguageSettings;

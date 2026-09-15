import { useDatabase } from "@/core/database/hooks/use-database";
import { settingService } from "@/core/database/settings";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Setting, SettingDocument } from "@/shared/types/database";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFlag } from "../../hooks/use-flag";
type Props = {
    settings: SettingDocument[];
};

const Flag = ({ value }: { value: string }) => {
    const { loading, src } = useFlag(value);

    if (!src) return;

    // TODO Loading
    return loading ? <p>Loading...</p> : <img src={src} alt={value} width={24} height={16} />;
};

const LanguageSettings = ({ settings }: Props) => {
    const { t, i18n } = useTranslation();
    const { saveToDatabase } = useDatabase();

    const [selectedLanguage, setSelectedLanguage] = useState({
        name: t(`features.settings.language.name.${i18n.language}`),
        flag: i18n.language,
    });
    const languageSetting = settingService.findDoc("general", "language", settings);

    const languageOptions = [
        {
            name: t("features.settings.language.name.fr"),
            value: "fr",
        },
        {
            name: t("features.settings.language.name.en-GB"),
            value: "en-gb",
        },
    ].sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));

    const createOrUpdateLanguageSetting = async (langValue: string) => {
        if (languageSetting) {
            const setting: SettingDocument = { ...languageSetting, value: langValue };
            await saveToDatabase<SettingDocument, PouchDB.Core.Response | void>(
                setting,
                settingService.updateDoc
            );
        } else {
            const setting: Setting<"language"> = {
                parent: "general",
                name: "language",
                value: langValue,
            };
            await saveToDatabase<Setting<"language">, PouchDB.Core.Response>(
                setting,
                settingService.createOrUpdateDoc
            );
        }
    };

    const handleLanguageChange = async (langValue: string | null): Promise<void> => {
        if (langValue) {
            setSelectedLanguage({
                name: t(`features.settings.language.name.${langValue}`),
                flag: langValue,
            });
            i18n.changeLanguage(langValue);

            await createOrUpdateLanguageSetting(langValue);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <p>{t("features.settings.language.desc")}</p>
            <Field className="w-full xl:w-1/3">
                <FieldLabel>{t("features.settings.language.title")}</FieldLabel>
                <Select
                    name="language"
                    value={selectedLanguage.name}
                    onValueChange={handleLanguageChange}
                >
                    <SelectTrigger id="language">
                        <Flag value={selectedLanguage.flag} />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                        {languageOptions.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                                <Flag value={lang.value} />
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    {/* TODO Handle errors */}
                </Select>
            </Field>
        </div>
    );
};

export default LanguageSettings;

import { useTranslation } from "react-i18next";

const BackupSettings = () => {
    const { t } = useTranslation();
    return <div> {t("features.settings.backup.desc")}</div>;
};

export default BackupSettings;

import { Separator } from "@/shared/components/ui/separator";
import { TypographyH1 } from "@/shared/components/ui/typography";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t } = useTranslation();
    return (
        <header className="flex flex-col gap-4 bg-background">
            <div className="w-full flex justify-between items-center px-8 pt-4 pb-2">
                <div className="flex flex-col">
                    <TypographyH1>{t("layout.header.title")}</TypographyH1>
                    <p className="text-sm font-bold italic text-primary">
                        {t("layout.header.desc")}
                    </p>
                </div>
            </div>
            <Separator className="mx-24" />
        </header>
    );
};

export { Header };

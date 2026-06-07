import { Separator } from "@/components/ui/separator";
import { TypographyH1 } from "@/components/ui/typography";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";

const Header = () => {
    const { t } = useTranslation();
    return (
        <header className="bg-background">
            <div className="w-full flex justify-between items-center px-8 pt-4 pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <TypographyH1>{t("layout.header.title")}</TypographyH1>
                            <p className="text-sm font-bold italic text-primary">
                                {t("layout.header.desc")}
                            </p>
                        </div>
                    </div>
                </div>

                <Settings width={34} height={34} />
            </div>
            <Separator className="mx-24" />
        </header>
    );
};

export { Header };

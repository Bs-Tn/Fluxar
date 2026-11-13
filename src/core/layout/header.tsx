import { SettingsMenu } from "@/features/settings/components/settings-menu";
import { Button } from "@/shared/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/components/ui/input-group";
import { Kbd, KbdGroup } from "@/shared/components/ui/kdb";
import { Separator } from "@/shared/components/ui/separator";
import { TypographyH1 } from "@/shared/components/ui/typography";
import { cn } from "@/shared/lib/utils";
import { Search, SlidersVertical } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

type HeaderTitleProps = {
    text: string;
    number: string;
    className?: string;
};

type IdentityProps = {
    verbs: string[];
    tagline: string;
};

const TitleVerb = ({ text, number, className }: HeaderTitleProps) => (
    <div className="flex flex-col">
        <span className="text-sm text-accent">{number}</span>
        <TypographyH1 className={cn("capitalize", className)}>{text}</TypographyH1>
    </div>
);

const HeaderIdentity = ({ verbs, tagline }: IdentityProps) => (
    <div className="flex flex-col gap-4 cursor-default">
        <div className="flex items-end gap-6">
            {verbs.map((v, i) => (
                <>
                    <TitleVerb
                        text={v}
                        number={`0${i + 1}`}
                        className={
                            verbs.length === i + 1
                                ? "bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60"
                                : undefined
                        }
                    />
                    {verbs.length !== i + 1 && <span className="h-6 text-3xl text-accent">°</span>}
                </>
            ))}
        </div>
        <p className="text-accent">{tagline}</p>
    </div>
);

// TODO Create search modal
const HeaderSearch = () => {
    const onChange = () => {
        console.log("onClick event");
    };
    return (
        <div className="cursor-pointer">
            <InputGroup className="h-12 w-100 bg-muted pointer-events-none">
                <InputGroupInput
                    id="input-group-url"
                    className="pointer-events-none"
                    placeholder="Rechercher..."
                    onChange={onChange}
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    <KbdGroup className="flex items-center">
                        <Kbd>Shift</Kbd>
                        <span>+</span>
                        <Kbd>S</Kbd>
                    </KbdGroup>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};

const HeaderSetting = ({ onOpen }: { onOpen: Dispatch<SetStateAction<boolean>> }) => {
    return (
        <Button variant="secondary" size="xl" onClick={() => onOpen(true)}>
            <SlidersVertical width={30} height={30} />
        </Button>
    );
};

const Header = () => {
    const { t } = useTranslation();

    const [openSettings, setOpenSettings] = useState<boolean>(false);

    return (
        <header className="flex flex-col gap-4 bg-background">
            {openSettings && <SettingsMenu open={openSettings} onOpen={setOpenSettings} />}
            <div className="w-full flex justify-between items-center px-8 pt-4 pb-2">
                <HeaderIdentity
                    verbs={[
                        t("core.layout.header.titles.centralize"),
                        t("core.layout.header.titles.visualize"),
                        t("core.layout.header.titles.find"),
                    ]}
                    tagline={t("core.layout.header.desc")}
                />
                <div className="flex gap-12 items-center justify-between">
                    <HeaderSearch />
                    <HeaderSetting onOpen={setOpenSettings} />
                </div>
            </div>
        </header>
    );
};

export { Header };

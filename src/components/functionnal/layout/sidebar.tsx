import { Fragment, JSX, useEffect, useState } from "react";
import ProjectCarousel from "@/components/ui/carousel";
import { EmblaOptionsType } from "embla-carousel";
import { Package, Monitor, PlugZap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ProjectCreationDialog } from "../project/dialog/project-creation-dialog";

export type SlideType = {
    path: string;
    icon: JSX.Element;
};

const SLIDES = [
    { path: "front", icon: <Monitor /> },
    { path: "api", icon: <PlugZap /> },
    { path: "package", icon: <Package /> },
    { path: "front", icon: <Monitor /> },
    { path: "api", icon: <PlugZap /> },
    { path: "package", icon: <Package /> },
];
const OPTIONS: EmblaOptionsType = { loop: true, axis: "y", align: "center" };

const Sidebar = () => {
    const { t } = useTranslation();

    const [openNewProject, setOpenNewProject] = useState<boolean>(false);

    return (
        <Fragment>
            <ProjectCreationDialog
                open={openNewProject}
                onOpen={setOpenNewProject}
            />
            <nav className="w-60 h-full flex flex-col items-center bg-background">
                <div className="pt-6">
                    <Button size="xl" onClick={() => setOpenNewProject(true)}>
                        <Plus />
                        {t("layout.sidebar.new-project")}
                    </Button>
                </div>
                <ProjectCarousel slides={SLIDES} options={OPTIONS} />
            </nav>
        </Fragment>
    );
};

export { Sidebar };

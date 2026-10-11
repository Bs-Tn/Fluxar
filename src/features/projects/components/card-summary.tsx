import { ComponentProps, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card/card-container";
import { TypographyH3 } from "@/shared/components/ui/typography";
import { openPath } from "@tauri-apps/plugin-opener";
import { ProjectDocument } from "@/shared/types/database";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

import { createPortal } from "react-dom";
import CardDetails from "./card-details";
import { CalendarFold, FileCodeCorner, FolderOpen, Maximize2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type Props = {
    project: ProjectDocument;
} & ComponentProps<"div">;

const MotionCard = motion.create(Card);
const MotionCardTitle = motion.create(CardTitle);

const CardSummary = ({ project, ...props }: Props) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState<boolean>(false);

    const key = project._id;
    const tagColor = project.tag?.color;
    const projectFirstLetter = project.name.split("")[0].toUpperCase();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open, close]);

    const onFolderOpen = async () => {
        try {
            await openPath(project.directoryPath);
        } catch (error) {
            console.error(error);
        }
    };

    const onProjectStart = async () => {
        // TODO For now, only open with vs code
        try {
            await openPath(project.directoryPath, "code");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <MotionCard
                layoutId={`card-${key}`}
                onClick={() => setOpen(true)}
                className="relative cursor-pointer gap-0"
                whileHover={{ y: -2 }}
            >
                <div
                    className="absolute top-0 left-2 h-12 w-12 rounded-ee-full rounded-es-full"
                    style={{ backgroundColor: tagColor, opacity: "50%" }}
                ></div>
                <CardHeader>
                    <MotionCardTitle className="w-full flex flex-col items-center gap-4">
                        <div className="w-full flex justify-end">
                            <p
                                className="h-5 w-fit flex items-center justify-center text-xs px-4 py-2 text-white font-bold rounded-md "
                                style={{ backgroundColor: tagColor }}
                            >
                                {project.tag?.name}
                            </p>
                        </div>
                        <div className="w-full flex items-center justify-start">
                            {/* <div
                                className="flex-none text-3xl text-white py-2 px-4 rounded-sm font-bold"
                                style={{ backgroundColor: tagColor, opacity: "50%" }}
                            >
                                <p>{projectFirstLetter}</p>
                            </div> */}
                            <div className="flex-1">
                                <TypographyH3 className="p-0">{project.name}</TypographyH3>
                            </div>
                        </div>
                    </MotionCardTitle>
                </CardHeader>
                <CardContent className="py-1">
                    <div className="w-full flex gap-2 justify-end">
                        <Button variant="outline">
                            <FolderOpen />
                            Explore
                        </Button>
                        <Button>
                            <FileCodeCorner />
                            Ouvrir
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className=" flex gap-2 items-center text-xs text-switch-background">
                        <CalendarFold size={20} />
                        <p>{project.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-switch-background">
                        <p>Voir détails</p>
                        <Maximize2 size={15} />
                    </div>
                </CardFooter>
            </MotionCard>
            {createPortal(
                <CardDetails open={open} onOpen={setOpen} project={project} />,
                document.body
            )}
        </>
    );
};

export default CardSummary;

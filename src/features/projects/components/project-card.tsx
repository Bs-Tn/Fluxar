import { ComponentProps } from "react";
import { Button } from "@/shared/components/ui/button";
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

type Props = {
    project: ProjectDocument;
} & ComponentProps<"div">;

const ProjectCard = ({ project, ...props }: Props) => {
    const tagColor = project.tag?.color;
    const projectFirstLetter = project.name.split("")[0].toUpperCase();

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
        <Card className="relative" {...props}>
            <div
                className="absolute top-0 right-2 h-14 w-12 rounded-ee-full rounded-es-full"
                style={{ backgroundColor: tagColor, opacity: "50%" }}
            ></div>
            <CardHeader className="flex flex-col gap-6">
                <CardTitle className="flex items-center gap-2">
                    <div
                        className="text-3xl text-white py-2 px-4 rounded-sm font-bold"
                        style={{ backgroundColor: tagColor, opacity: "50%" }}
                    >
                        <p>{projectFirstLetter}</p>
                    </div>
                    <div>
                        <TypographyH3 className="p-0">{project.name}</TypographyH3>
                        <div
                            className="text-xs h-5 w-fit px-4 py-2 text-white font-bold rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: tagColor }}
                        >
                            <p>{project.tag?.name}</p>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="w-full flex justify-end gap-3">
                <Button onClick={onFolderOpen} variant="outline">
                    Ouvrir le dossier
                </Button>
                <Button onClick={onProjectStart}>Démarrer le projet</Button>
            </CardFooter>
        </Card>
    );
};

export default ProjectCard;

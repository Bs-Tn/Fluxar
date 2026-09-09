import { Dispatch, FC, SetStateAction } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { projectSchema, ProjectSchema } from "../validation/project.schema";
import { Button } from "@/shared/components/ui/button";
import { ProjectCategoryValue } from "@/shared/types/form";
import { Separator } from "@/shared/components/ui/separator";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@/shared/types/database";
import { projectService } from "@/core/database/project";
import { ProjectCreationForm } from "./project-creation-form";

type Props = {
    open: boolean;
    onOpen: Dispatch<SetStateAction<boolean>>;
};

const ProjectCreationDialog: FC<Props> = ({ open, onOpen }) => {
    const { t } = useTranslation();

    const methods = useForm<ProjectSchema>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            category: ProjectCategoryValue.FRONTEND,
            name: "",
            tag: { name: "", color: "" },
            directoryPath: "",
            urlEndpoint: undefined,
        },
    });

    const onSubmit: SubmitHandler<ProjectSchema> = async (data) => {
        try {
            const newProject: Project = {
                category: data.category,
                name: data.name,
                tag: data.tag ?? undefined,
                directoryPath: data.directoryPath,
                urlEndpoint: data.urlEndpoint ?? undefined,
            };

            await projectService.createDoc(newProject);

            onOpen(!open);
            methods.reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpen} disablePointerDismissal={true}>
            <DialogContent className="flex flex-col gap-3 min-w-1/3 px-12 py-8">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-2xl font-extrabold">
                        {t("form.project.title")}
                    </DialogTitle>
                    <Separator className="mx-4" />
                    <DialogDescription>{t("form.project.info")}</DialogDescription>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form
                        className="flex flex-col gap-6 w-full"
                        onSubmit={methods.handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col gap-4">
                            <ProjectCreationForm />
                        </div>

                        <DialogFooter className="w-full flex justify-between">
                            <Button
                                size="xl"
                                variant="outline"
                                className="font-bold w-24"
                                onClick={() => methods.reset()}
                            >
                                {t("shared.reset")}
                            </Button>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="font-bold w-24"
                                    onClick={() => onOpen(!open)}
                                >
                                    {t("shared.close")}
                                </Button>
                                <Button type="submit" size="xl" className="font-bold w-24">
                                    {t("shared.confirm")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export { ProjectCreationDialog };

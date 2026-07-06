import { TypographyH2 } from "@/components/ui/typography";
import ProjectCard from "./card/project-card";
import { ProjectDocument } from "@/types/database";

type Props = {
    projectCategory?: string;
    projects: ProjectDocument[];
};

const ProjectSection = ({ projectCategory, projects }: Props) => {
    return (
        <section className="flex flex-col gap-4">
            <TypographyH2>{projectCategory}</TypographyH2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
                {projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))}
            </div>
        </section>
    );
};

export { ProjectSection };

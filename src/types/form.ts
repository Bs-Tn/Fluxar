export const ProjectCategoryValue = {
    FRONTEND: "Frontend",
    API: "Api",
    PACKAGE: "Package",
    OTHER: "Other",
} as const;

export type ProjectCategory = (typeof ProjectCategoryValue)[keyof typeof ProjectCategoryValue];

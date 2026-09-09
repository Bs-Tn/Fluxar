import * as z from "zod";
import { ProjectCategoryValue } from "@/shared/types/form";
import i18n from "i18next";
import { tagSchema } from "./tag.schema";

export const projectSchema = z.object({
    category: z.enum([
        ProjectCategoryValue.FRONTEND,
        ProjectCategoryValue.API,
        ProjectCategoryValue.PACKAGE,
    ]),
    name: z
        .string()
        .min(3, {
            error: (issue) => {
                if (issue.code === "too_small") {
                    return i18n.t("form.project.error.name.length");
                }
            },
        })
        .max(30, {
            error: (issue) => {
                if (issue.code === "too_big") {
                    return i18n.t("form.project.error.name.length");
                }
            },
        }),
    tag: tagSchema,
    directoryPath: z.string(),
    urlEndpoint: z.string().optional(),
});

export type ProjectSchema = z.infer<typeof projectSchema>;

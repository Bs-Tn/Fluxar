import * as z from "zod";
import { ProjectCategoryValue } from "@/types/form";
import i18n from "i18next";

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
    tag: z.string().optional(),
    directoryPath: z.string(),
    urlEndpoint: z
        .httpUrl({
            error: (issue) => {
                if (issue.code === "invalid_type") return i18n.t("form.project.error.url-endpoint");

                if (issue.code === "invalid_format")
                    return i18n.t("form.project.error.url-endpoint");
            },
        })
        .optional(),
});

export type ProjectSchema = z.infer<typeof projectSchema>;

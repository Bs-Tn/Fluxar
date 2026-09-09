import * as z from "zod";

export const tagSchema = z.object({
    name: z.string(),
    color: z.string(),
});

export type TagSchema = z.infer<typeof tagSchema>;

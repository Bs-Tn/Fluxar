import React from "react";
import { FrontendProject } from "./project/frontend-project";

export const PATH_PROJECT = {
    FRONT: "FRONT",
    API: "API",
    PACKAGE: "PACKAGE",
} as const;

export type PathProjectType = keyof typeof PATH_PROJECT;

const Dashboard = () => {
    const path: PathProjectType = "FRONT";

    // if (path === PATH_PROJECT.API) {
    //     return <div></div>;
    // }

    // if (path === PATH_PROJECT.PACKAGE) {
    //     return <div></div>;
    // }

    return (
        <div>
            <FrontendProject />
        </div>
    );
};

export { Dashboard };

import { createContext, useState } from "react";
import "./App.css";
import { Header } from "./core/layout/header";
import { RootContextType } from "./shared/types/context";
import { useDatabase } from "./core/database/hooks/use-database";
import { ProjectCategory } from "./shared/types/common";
import { Dashboard } from "./features/dashboard/dashboard";
import { StartupScreen } from "./core/layout/startup-screen";

export const RootContext = createContext<RootContextType>({
    documents: {
        projectDocuments: [],
        tagDocuments: [],
        settingDocuments: [],
    },
    selectedProjectCategory: ProjectCategory.ALL,
    setSelectedProjectCategory: () => {},
});

function App() {
    const { projects, tags, settings } = useDatabase();
    const [selectedProjectCategory, setSelectedProjectCategory] = useState<string>(
        ProjectCategory.ALL
    );

    return (
        <RootContext.Provider
            value={{
                documents: {
                    projectDocuments: projects,
                    tagDocuments: tags,
                    settingDocuments: settings,
                },
                selectedProjectCategory,
                setSelectedProjectCategory,
            }}
        >
            {/* <StartupScreen> */}
            <div className="flex flex-col gap-4 h-screen">
                <Header />
                <div className="flex w-full h-full">
                    <main className="w-full bg-background px-6 pb-6">
                        <Dashboard />
                    </main>
                </div>
            </div>
            {/* </StartupScreen> */}
        </RootContext.Provider>
    );
}

export default App;

import { createContext, useState } from "react";
import "./App.css";
import { Header } from "./core/layout/header";
import { Sidebar } from "./core/layout/sidebar";
import { RootContextType } from "./shared/types/context";
import { useDatabase } from "./core/database/hooks/use-database";
import { ProjectCategory } from "./shared/types/common";
import { Dashboard } from "./features/dashboard/dashboard";

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
        <div className="flex flex-col gap-6 h-screen">
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
                <Header />
                <div className="flex w-full h-full">
                    <Sidebar />
                    <main className="w-full bg-background p-6">
                        <Dashboard />
                    </main>
                </div>
            </RootContext.Provider>
        </div>
    );
}

export default App;

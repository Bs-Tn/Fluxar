import { createContext, useState } from "react";
import "./App.css";
import { Header } from "./core/layout/header";
import { Sidebar } from "./core/layout/sidebar";
import { RootContextType } from "./shared/types/context";
import { useDatabase } from "./core/database/hooks/use-database";
import { ProjectCategory } from "./shared/types/common";
import { Dashboard } from "./features/dashboard/dashboard";

export const RootContext = createContext<RootContextType>({
    projectDocuments: [],
    tagDocuments: [],
    selectedProjectCategory: ProjectCategory.ALL,
    setSelectedProjectCategory: () => {},
});

function App() {
    const { projects, tags } = useDatabase();
    const [selectedProjectCategory, setSelectedProjectCategory] = useState<string>(
        ProjectCategory.ALL
    );

    return (
        <div className="flex flex-col gap-6 h-screen">
            <RootContext.Provider
                value={{
                    projectDocuments: projects,
                    tagDocuments: tags,
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

// Feature check package
/**
 * Permissions Tauri : N'oublie pas d'autoriser la commande dans ton fichier src-tauri/capabilities/default.json :

JSON
{
  "permissions": [
    "core:default",
    "dialog:allow-open",
    "shell:allow-execute",
    "http:default" 
  ]
}
1. L'approche Rust (Recommandée)
L'idée est de créer une commande Rust (command) qui prend le chemin du fichier, le lit, et interroge le registre NPM pour obtenir les dernières versions.

Le Backend (main.rs)
Tu peux utiliser serde_json pour lire le fichier et la crate reqwest pour interroger l'API de NPM.

Rust
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize)]
struct PackageJson {
    dependencies: Option<HashMap<String, String>>,
    #[serde(rename = "devDependencies")]
    dev_dependencies: Option<HashMap<String, String>>,
}

#[derive(Serialize)]
struct DependencyStatus {
    name: String,
    current: String,
    latest: String,
}

#[tauri::command]
async fn check_package_updates(path: String) -> Result<Vec<DependencyStatus>, String> {
    // 1. Lire le fichier package.json
    let content = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
    let pkg: PackageJson = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    let mut results = Vec::new();
    let client = reqwest::Client::new();

    // 2. Fusionner les dépendances pour tout checker
    let mut all_deps = pkg.dependencies.unwrap_or_default();
    all_deps.extend(pkg.dev_dependencies.unwrap_or_default());

    for (name, version) in all_deps {
        // 3. Appeler l'API NPM pour chaque package
        let url = format!("https://registry.npmjs.org/{}/latest", name);
        if let Ok(resp) = client.get(url).send().await {
            if let Ok(json) = resp.json::<serde_json::Value>().await {
                if let Some(latest_version) = json["version"].as_str() {
                    results.push(DependencyStatus {
                        name,
                        current: version,
                        latest: latest_version.to_string(),
                    });
                }
            }
        }
    }

    Ok(results)
}
Le Frontend (React, Vue, ou Svelte)
Tu appelles simplement la commande avec le chemin choisi par l'utilisateur.

JavaScript
import { invoke } from '@tauri-apps/api/core';

async function checkUpdates(filePath) {
  try {
    const updates = await invoke('check_package_updates', { path: filePath });
    console.log("Liste des versions :", updates);
  } catch (error) {
    console.error("Erreur lors du check :", error);
  }
}

2. Amélioration : Sélection du fichier
Pour que l'utilisateur renseigne le chemin sans faire de fautes de frappe, utilise le plugin @tauri-apps/plugin-dialog.

JavaScript
import { open } from '@tauri-apps/plugin-dialog';

const selectFile = async () => {
  const selected = await open({
    multiple: false,
    filters: [{ name: 'Package JSON', extensions: ['json'] }]
  });
  if (selected) {
    // Tu as maintenant le path complet vers le package.json
    checkUpdates(selected);
  }
};
 */

import { Fragment, JSX, useState } from "react";
import ProjectCarousel from "@/shared/components/ui/carousel/carousel";
import { EmblaOptionsType } from "embla-carousel";
import { Package, Monitor, PlugZap, Plus, LayoutGrid, SlidersVertical, Layers } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "react-i18next";
import { ProjectCreationDialog } from "../../features/projects/components/project-creation-dialog";
import { ProjectCategory } from "@/shared/types/common";
import { t } from "i18next";
import { SettingsMenu } from "../../features/settings/components/settings-menu";

export type SlideType = {
    path: string;
    icon: JSX.Element;
    label: string;
};

const SLIDES = [
    { path: ProjectCategory.ALL, icon: <LayoutGrid />, label: t("shared.categories.all") },
    { path: ProjectCategory.FRONTEND, icon: <Monitor />, label: t("shared.categories.frontend") },
    { path: ProjectCategory.API, icon: <PlugZap />, label: t("shared.categories.api") },
    { path: ProjectCategory.PACKAGE, icon: <Package />, label: t("shared.categories.package") },
    { path: ProjectCategory.OTHER, icon: <Layers />, label: t("shared.categories.other") },
];
const OPTIONS: EmblaOptionsType = { loop: true, axis: "y", align: "center" };

const Sidebar = () => {
    const { t } = useTranslation();

    const [openProjectCreation, setOpenProjectCreation] = useState<boolean>(false);
    const [openSettings, setOpenSettings] = useState<boolean>(false);

    return (
        <Fragment>
            {/* DIALOG */}
            <ProjectCreationDialog open={openProjectCreation} onOpen={setOpenProjectCreation} />
            <SettingsMenu open={openSettings} onOpen={setOpenSettings} />
            {/* ========================= */}

            <div className="flex flex-col pb-6">
                <nav className="w-50 h-full flex flex-col items-center bg-background ">
                    <Button
                        className="font-bold hover:scale-103"
                        size="xl"
                        onClick={() => setOpenProjectCreation(true)}
                    >
                        <Plus className="font-bold" />
                        {t("layout.sidebar.new-project")}
                    </Button>
                    <ProjectCarousel
                        className="h-3/4 items-center"
                        slides={SLIDES}
                        options={OPTIONS}
                    />
                </nav>
                <div
                    onClick={() => setOpenSettings(true)}
                    className="flex gap-2 items-center justify-center mx-auto font-bold hover:text-primary cursor-pointer"
                >
                    <SlidersVertical width={30} height={30} />
                    <p>{t("shared.settings")}</p>
                </div>
            </div>
        </Fragment>
    );
};

export { Sidebar };

// 1. Activer les plugins Tauri nécessaires
// Vous devez vous assurer que votre projet Tauri a accès aux fonctionnalités de dialogue et de système de fichiers.

// Dans votre fichier src-tauri/capabilities/default.json (ou tauri.conf.json selon votre version de Tauri), assurez-vous d'autoriser les permissions pour :

// dialog:allow-save

// fs:allow-write

// 2. Le code JavaScript / TypeScript
// Voici la fonction à intégrer dans votre frontend pour récupérer les données de PouchDB et les enregistrer là où l'utilisateur le souhaite :

// JavaScript
// import PouchDB from 'pouchdb';
// import { save } from '@tauri-apps/plugin-dialog';
// import { writeTextFile } from '@tauri-apps/plugin-fs';

// const db = new PouchDB('ma_base_de_donnees');

// async function exporterBackup() {
//   try {
//     // 1. Récupérer tous les documents de PouchDB (incluant le contenu)
//     const result = await db.allDocs({ include_docs: true });

//     // Extraire uniquement les documents d'origine
//     const backupData = result.rows.map(row => row.doc);
//     const jsonString = JSON.stringify(backupData, null, 2);

//     // 2. Ouvrir la boîte de dialogue Tauri pour choisir l'emplacement
//     const filePath = await save({
//       title: 'Choisir l'emplacement de la sauvegarde',
//       defaultPath: 'backup-pouchdb.json',
//       filters: [{
//         name: 'JSON',
//         extensions: ['json']
//       }]
//     });

//     // Si l'utilisateur annule, filePath sera null
//     if (!filePath) {
//       console.log("Sauvegarde annulée par l'utilisateur");
//       return;
//     }

//     // 3. Écrire le fichier sur le disque de l'utilisateur
//     await writeTextFile(filePath, jsonString);

//     alert('Sauvegarde réussie !');
//   } catch (error) {
//     console.error('Erreur lors de la sauvegarde :', error);
//     alert('Une erreur est survenue lors de la sauvegarde.');
//   }
// }
// 3. Comment restaurer ce backup plus tard ?
// Si vous voulez faire le chemin inverse (permettre à l'utilisateur de charger ce fichier JSON pour écraser ou remplir PouchDB), vous utiliserez open de @tauri-apps/plugin-dialog, readTextFile de @tauri-apps/plugin-fs, puis la méthode db.bulkDocs de PouchDB :

// JavaScript
// import { open } from '@tauri-apps/plugin-dialog';
// import { readTextFile } from '@tauri-apps/plugin-fs';

// async function importerBackup() {
//   try {
//     // 1. Sélectionner le fichier de sauvegarde
//     const selectedPath = await open({
//       multiple: false,
//       filters: [{ name: 'JSON', extensions: ['json'] }]
//     });

//     if (!selectedPath) return;

//     // 2. Lire le contenu du fichier
//     const content = await readTextFile(selectedPath);
//     const docsToImport = JSON.parse(content);

//     // Nettoyer les identifiants de révision (_rev) pour éviter les conflits lors de l'import
//     const cleanedDocs = docsToImport.map(({ _rev, ...doc }) => doc);

//     // 3. Insérer dans PouchDB
//     await db.bulkDocs(cleanedDocs);
//     alert('Données importées avec succès !');
//   } catch (error) {
//     console.error('Erreur lors de l\'import :', error);
//   }
// }
// 💡 Note : Si votre base de données PouchDB devient très volumineuse (plusieurs dizaines ou centaines de Mo), l'utilisation de JSON.stringify sur la totalité des données peut saturer la mémoire du navigateur. Pour de très grosses bases de données, il est souvent préférable d'utiliser un plugin PouchDB dédié au streaming ou à la réplication (comme pouchdb-replication-stream), mais pour une application classique, la méthode JSON ci-dessus fonctionne parfaitement.

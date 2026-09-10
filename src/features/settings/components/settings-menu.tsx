import { Dispatch, JSX, lazy, SetStateAction, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { MenuItemsProps, MenuSectionProps, SettingsDialogProps } from "../types";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import {
    Sidebar,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
} from "@/shared/components/ui/sidebar";
import { ChevronRight, SquareTerminal } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { cn } from "@/shared/lib/utils";

const Menu = ({
    sections,
    onItemsChange,
}: {
    sections: MenuSectionProps[];
    onItemsChange: Dispatch<SetStateAction<MenuSectionProps[]>>;
}): JSX.Element => {
    const { t } = useTranslation();

    // Determines which element is active or not
    const updatedMenuItemStatus = (items: MenuItemsProps[], itemId: string) =>
        items.map((item) => ({ ...item, isActive: item.id === itemId }));

    // Update the menu items
    const handleItemsChange = (itemId: string) => {
        const updatedMenuItems = sections.map((section) => ({
            ...section,
            items: updatedMenuItemStatus(section.items, itemId),
        }));

        onItemsChange(updatedMenuItems);
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-black font-bold text-md">
                {t("shared.settings")}
            </SidebarGroupLabel>
            <SidebarMenu>
                {sections.map((section) => (
                    <Collapsible
                        key={section.title}
                        defaultOpen={section.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger
                                render={
                                    <SidebarMenuButton
                                        className="cursor-pointer"
                                        tooltip={section.title}
                                    />
                                }
                            >
                                {section.icon && <section.icon />}
                                <span>{section.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {section.items?.map((item: MenuItemsProps) => (
                                        <SidebarMenuSubItem key={item.title}>
                                            <SidebarMenuSubButton
                                                className={cn(
                                                    "cursor-pointer",
                                                    item.isActive &&
                                                        "bg-primary text-white rounded-sm hover:bg-primary hover:text-white"
                                                )}
                                                onClick={() => handleItemsChange(item.id)}
                                            >
                                                <span>{item.title}</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
};

const SettingsMenu = ({ open, onOpen }: SettingsDialogProps) => {
    const [menuItems, setMenuItems] = useState<MenuSectionProps[]>([
        {
            title: "General",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    id: "general.backup",
                    title: "Sauvegarde",
                    isActive: true,
                    component: lazy(() => import("./menu/backup-settings")),
                },
                {
                    id: "general.language",
                    title: "Langue",
                    isActive: false,
                    component: lazy(() => import("./menu/language-settings")),
                },
            ],
        },
    ]);

    const SelectedComponent = menuItems
        .flatMap((section) => section.items ?? [])
        .find((item) => item.isActive)?.component;

    return (
        <Dialog open={open} onOpenChange={onOpen}>
            <DialogContent className="min-w-3/4 h-[80vh] flex flex-col gap-3">
                <SidebarProvider className="h-full min-h-0 w-full flex">
                    <Sidebar collapsible="none" className="w-64 shrink-0 h-full bg-white border-r">
                        <Menu sections={menuItems} onItemsChange={setMenuItems} />
                    </Sidebar>
                    <div className="flex-1 min-w-0 h-full overflow-y-auto p-6">
                        <Suspense fallback={<p>Chargement...</p>}>
                            {SelectedComponent && <SelectedComponent />}
                        </Suspense>
                    </div>
                </SidebarProvider>
            </DialogContent>
        </Dialog>
    );
};

export { SettingsMenu };

import { useTranslation } from "react-i18next";
import { SettingsDialogProps } from "../types";
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
import { ChevronRight, Settings2, SquareTerminal } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

const data = [
    {
        title: "General",
        icon: SquareTerminal,
        isActive: true,
        items: [
            {
                title: "Langue",
            },
            {
                title: "Mock2",
            },
            {
                title: "Mock3",
            },
        ],
    },

    {
        title: "Sauvegarde",
        url: "#",
        icon: Settings2,
        items: [],
    },
];

function NavMain({
    items,
}: {
    items: {
        title: string;
        icon?: React.ElementType;
        isActive?: boolean;
        items?: {
            title: string;
        }[];
    }[];
}) {
    const { t } = useTranslation();

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-md">
                {t("shared.settings")}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} />}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton>
                                                <span>{subItem.title}</span>
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
}

const SettingsMenu = ({ open, onOpen }: SettingsDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpen}>
            <DialogContent className="min-w-1/2 h-[80vh] flex flex-col gap-3">
                <SidebarProvider className="h-full min-h-0 w-full flex">
                    <Sidebar collapsible="none" className="w-64 shrink-0 h-full bg-white border-r">
                        <NavMain items={data} />
                    </Sidebar>
                    <div className="flex-1 min-w-0 h-full overflow-y-auto p-6">
                        <div>Content</div>
                    </div>
                </SidebarProvider>
            </DialogContent>
        </Dialog>
    );
};

export { SettingsMenu };

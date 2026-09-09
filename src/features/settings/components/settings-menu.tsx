import { useTranslation } from "react-i18next";
import { SettingsDialogProps } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";

const SettingsMenu = ({ open, onOpen }: SettingsDialogProps) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpen}>
            <DialogContent className="flex flex-col gap-3 min-w-1/2 py-8">
                <DialogHeader>
                    <DialogTitle className="font-bold uppercase">
                        {t("shared.settings")}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex">
                    <div className="min-w-50 flex flex-col gap-1 bg-gray-200 rounded-b-md shrink-0 w-max py-4 px-1">
                        <p className="bg-white w-full rounded-md px-4 py-2">
                            {t("shared.project_other")}
                        </p>
                        <p>Sauvegarde</p>
                    </div>
                    <div className="flex-1 h-50 px-6 py-2 border-t border-gray-200">Contenue</div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { SettingsMenu };

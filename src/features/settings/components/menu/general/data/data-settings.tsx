import { settingService } from "@/core/database/settings";

import { SettingDocument } from "@/shared/types/database";

import { Backup } from "./backup/backup";
import { Synchronization } from "./sync/synchronization";

type Props = {
    settings: SettingDocument[];
};

const DataSettings = ({ settings }: Props) => {
    const backupSetting = settingService.findDoc("general", "backup", settings);
    console.log(backupSetting);
    return (
        <div className="flex flex-col gap-8">
            <section>
                <Backup backupSetting={backupSetting} />
            </section>
            <section>
                <Synchronization backupSetting={backupSetting} />
            </section>
        </div>
    );
};

export default DataSettings;

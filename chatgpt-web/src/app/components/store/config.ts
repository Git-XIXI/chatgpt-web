import {create} from "zustand";
import {persist} from "zustand/middleware";

export const DEFAULT_CONFIG = {
    tightBorder: false,
}
export type ChatConfig = typeof DEFAULT_CONFIG;

export type ChatConfigStore = ChatConfig & {
    reset: () => void;
    update: (updater: (config: ChatConfig) => void) => void;
};

export const useAppConfig = create<ChatConfigStore>()(
    persist(
        (set, get) => ({
            ...DEFAULT_CONFIG,

            reset() {
                set(() => ({...DEFAULT_CONFIG}));
            },

            update(updater:any) {
                const config = {...get()};
                updater(config);
                set(() => config);
            },
        }),
        {
            name: "app-config",
            version: 2,
            migrate(persistedState, version) {
                if (version === 2) return persistedState as any;
                return persistedState as ChatConfig;
            },
        },
    )
);
// components/TextAlignSelect.tsx
import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec, TextAlignButton } from "@blocknote/react";
import { Menu } from "@mantine/core";
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    ChevronDown,
    ChevronDownIcon,
} from "lucide-react"; // or your own icons

export const TextAlignSelect = () => (
    <div className="flex items-center gap-2 border-l-2 border-gray-300 pl-4">
        <Menu withinPortal={false}>
            <Menu.Target>
                <div className="flex items-center">
                    <AlignLeft size={16} />
                    <ChevronDownIcon size={16} />
                </div>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item>
                    <TextAlignButton
                        key={"textAlignLeft"}
                        textAlignment="left"
                    />
                </Menu.Item>

                <Menu.Item>
                    <TextAlignButton
                        key={"textAlignRight"}
                        textAlignment="right"
                    />
                </Menu.Item>

                <Menu.Item>
                    <TextAlignButton
                        key={"textAlignCenter"}
                        textAlignment="center"
                    />
                </Menu.Item>

                <Menu.Item>
                    <TextAlignButton
                        key={"textAlignJustify"}
                        textAlignment="justify"
                    />
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </div>
);

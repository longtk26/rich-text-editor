import "@blocknote/mantine/style.css";
import { useBlockNoteEditor, useComponentsContext } from "@blocknote/react";
import { useRef } from "react";

export function InsertFileButton({ editor }: { editor: any }) {
    const Components = useComponentsContext()!;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Gọi uploadFile được định nghĩa trong useCreateBlockNote
        const uploadedUrl = await editor.uploadFile(file);

        // Sau khi upload xong, chèn link file vào editor
        editor.insertBlocks(
            [
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "📎 File uploaded: ",
                        },
                        {
                            type: "link",
                            href: uploadedUrl,
                            content: [{ type: "text", text: file.name }],
                        },
                    ],
                },
            ],
            editor.getSelection().block
        );

        // Reset input
        event.target.value = "";
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <Components.FormattingToolbar.Button
                mainTooltip="Insert File"
                onClick={() => fileInputRef.current?.click()}
                isSelected={false}
            >
                📎
            </Components.FormattingToolbar.Button>
        </>
    );
}

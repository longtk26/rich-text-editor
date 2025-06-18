import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import { useComponentsContext } from "@blocknote/react";
import { useRef, useState } from "react";
import { FileIcon } from "lucide-react";

export function InsertFileButton({ editor }: { editor: BlockNoteEditor }) {
    const Components = useComponentsContext()!;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file || !editor.uploadFile) return;

        try {
            setIsUploading(true);

            // Get file extension to determine if it's an image
            const fileExtension =
                file.name.split(".").pop()?.toLowerCase() || "";
            const isImage = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "webp",
                "svg",
            ].includes(fileExtension);

            // Upload the file using editor's uploadFile function
            const uploadedUrl = await editor.uploadFile(file);
            const fileUrl = typeof uploadedUrl === "string" ? uploadedUrl : "";

            editor.insertBlocks(
                [
                    {
                        type: isImage ? "image" : "file",
                        props: {
                            url: fileUrl,
                            name: file.name,
                            backgroundColor: "default",
                        },
                    },
                ],
                editor.getTextCursorPosition().block, // Insert after current block
                "after"
            );
        } catch (error) {
            console.error("Error uploading file:", error);
            editor.insertBlocks(
                [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: "❌ Error uploading file: " + file.name,
                                styles: { textColor: "red" },
                            },
                        ],
                    },
                ],
                editor.getTextCursorPosition().block,
                "after"
            );
        } finally {
            // Reset input and uploading state
            event.target.value = "";
            setIsUploading(false);
        }
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
                isDisabled={isUploading}
            >
                <FileIcon className="w-4 h-4" />
            </Components.FormattingToolbar.Button>
        </>
    );
}

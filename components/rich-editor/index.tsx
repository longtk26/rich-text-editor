"use client";

import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState } from "react";
import {
    Block,
    BlockNoteEditor,
    BlockNoteSchema,
    defaultBlockSpecs,
    PartialBlock,
} from "@blocknote/core";
import Loading from "../loading";
import useDebounce from "@/hooks/useDebounce";
import { loadFromStorage, saveToStorage } from "@/utils/local-storage";
import {
    BasicTextStyleButton,
    BlockTypeSelect,
    FileCaptionButton,
    FileReplaceButton,
    FormattingToolbar,
    useCreateBlockNote,
    blockTypeSelectItems,
    AddFileButton,
    FileDownloadButton,
} from "@blocknote/react";
import { Link as LinkIcon } from "lucide-react";
import { TextAlignSelect } from "./text-align-select";
import { InsertFileButton } from "./insert-file-button";

const RichEditor = () => {
    const [initialContent, setInitialContent] = useState<
        PartialBlock[] | undefined | "loading"
    >("loading");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const { debouncedValue: debounceBlocksValue, isSaving } = useDebounce<
        Block[]
    >(blocks, 500);

    const editor = useCreateBlockNote({
        initialContent: [
            {
                type: "paragraph",
                content: "Welcome to this demo!",
            },
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: "You can now toggle ",
                        styles: {},
                    },
                    {
                        type: "text",
                        text: "blue",
                        styles: { textColor: "blue", backgroundColor: "blue" },
                    },
                    {
                        type: "text",
                        text: " and ",
                        styles: {},
                    },
                    {
                        type: "text",
                        text: "code",
                        styles: { code: true },
                    },
                    {
                        type: "text",
                        text: " styles with new buttons in the Formatting Toolbar",
                        styles: {},
                    },
                ],
            },
            {
                type: "paragraph",
                content: "Select some text to try them out",
            },
            {
                type: "paragraph",
            },
        ],
        uploadFile: async (file) => {
            console.log("Uploading file:", file);
            const buffer = await file.arrayBuffer();
            // convert the buffer to a base64 string
            return "/OIP.jpg";
        },
    });

    async function saveContent() {
        // Saves the current editor content to local storage.
        console.log("Saving content to storage...");
        if (blocks.length > 0) {
            await saveToStorage<Block[]>("editorContent", blocks);
            console.log("Content saved successfully.");
        } else {
            console.warn("No content to save.");
        }
    }

    useEffect(() => {
        console.log("Initializing editor...");
        loadFromStorage<Block[]>("editorContent").then((content) => {
            console.log("Loaded content from storage:", content);
            setInitialContent(content);
        });
    }, []);

    useEffect(() => {
        if (!debounceBlocksValue.length) {
            return;
        }
        saveToStorage<Block[]>("editorContent", debounceBlocksValue);
    }, [debounceBlocksValue]);

    // const editor = useMemo(() => {
    //     if (initialContent === "loading") {
    //         return undefined;
    //     }
    //     return BlockNoteEditor.create({
    //         initialContent,
    //         uploadFile: async (file) => {
    //             console.log("Uploading file:", file);
    //             const buffer = await file.arrayBuffer();
    //             // convert the buffer to a base64 string
    //             return "/OIP.jpg";
    //         },
    //         placeholders: {
    //             default: "Type here...",
    //         },
    //     });
    // }, [initialContent]);

    if (editor === undefined) {
        return "Loading content...";
    }

    return (
        // <section className="border-2 border-gray-300 p-4 rounded-lg w-full">
        //     <BlockNoteView
        //         editor={editor}
        //         theme={"light"}
        //         onChange={() => {
        //             const jsonBlocks = editor.document;
        //             setBlocks(jsonBlocks);
        //         }}
        //         formattingToolbar={false}
        //     >
        //         <FormattingToolbar />
        //     </BlockNoteView>
        //     <div className="w-full text-right flex items-center justify-end gap-2 mt-4">
        //         {isSaving && <Loading />}
        //         <button
        //             className="border-1 border-black rounded-2xl px-2 py-1
        //             hover:bg-green-200 transition-colors duration-300 cursor-pointer"
        //             onClick={saveContent}
        //         >
        //             Save Content
        //         </button>
        //     </div>
        // </section>
        <>
            <BlockNoteView
                editor={editor}
                theme={"light"}
                // onChange={() => {
                //     const jsonBlocks = editor.document;
                //     setBlocks(jsonBlocks);
                // }}
                formattingToolbar={false}
            >
                <FormattingToolbar>
                    <FileCaptionButton key={"fileCaptionButton"} />
                    <FileReplaceButton key={"replaceFileButton"} />
                    <BasicTextStyleButton
                        basicTextStyle={"bold"}
                        key={"boldStyleButton"}
                    />
                    <BasicTextStyleButton
                        basicTextStyle={"italic"}
                        key={"italicStyleButton"}
                    />
                    <BasicTextStyleButton
                        basicTextStyle={"underline"}
                        key={"underlineStyleButton"}
                    />
                    <InsertFileButton editor={editor} />
                    <TextAlignSelect />
                </FormattingToolbar>
            </BlockNoteView>
        </>
    );
};

export default RichEditor;

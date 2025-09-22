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
    defaultInlineContentSpecs,
    PartialBlock,
} from "@blocknote/core";
import useDebounce from "@/hooks/useDebounce";
import { loadFromStorage, saveToStorage } from "@/utils/local-storage";
import {
    BasicTextStyleButton,
    FormattingToolbar,
    useCreateBlockNote,
} from "@blocknote/react";
import { TextAlignSelect } from "./text-align-select";
import { InsertFileButton } from "./insert-file-button";
import { useHighlight } from "./highlight";
import { MemoModal } from "./memo-modal";
import { Notebook } from "lucide-react";

interface MemoModalState {
    isOpen: boolean;
    highlightId: string;
    highlightText: string;
    currentMemo: string;
}

const RichEditor = () => {
    const [blocks, setBlocks] = useState<CustomBlock[]>([]);
    const [selectedText, setSelectedText] = useState<string>("");
    const [showNoteIcon, setShowNoteIcon] = useState(false);
    const [iconPos, setIconPos] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });
    const { debouncedValue } = useDebounce(selectedText, 1000);
    const [memoModal, setMemoModal] = useState<MemoModalState>({
        isOpen: false,
        highlightId: "",
        highlightText: "",
        currentMemo: "",
    });
    const initHighlights = [
        {
            id: "c0e9f70-e668-4caf-af4b-284830024138",
            memo: "this2",
            color: "#ffeb3b",
            createdAt: new Date().toISOString(),
            content: "this",
        },
        {
            id: "d1f9f70-e668-4caf-af4b-284830024139",
            memo: "Welw wl2",
            color: "#ffeb3b",
            createdAt: new Date().toISOString(),
            content: "Welcome",
        },
    ];

    const { highLight } = useHighlight({
        onOpenMemoModal: (highlightId, highlightText, memo) => {
            console.log(`Opening memo modal for highlightId: ${highlightId}`);
            // const existingHighlight = blocks
            //     .flatMap((block) => block.content || [])
            //     .find(
            //         (content) =>
            //             (content as any).type === "highlight" &&
            //             (content as any).props?.id === highlightId
            //     ) as any;

            setMemoModal({
                isOpen: true,
                highlightId,
                highlightText,
                currentMemo: memo,
            });
        },
    });
    // Create schema outside the component
    const schema = BlockNoteSchema.create({
        blockSpecs: {
            ...defaultBlockSpecs,
        },
        inlineContentSpecs: {
            ...defaultInlineContentSpecs,
            highlight: highLight,
        },
    });
    type CustomSchema = typeof schema;
    type CustomBlock = Block<
        CustomSchema["blockSchema"],
        CustomSchema["inlineContentSchema"],
        CustomSchema["styleSchema"]
    >;
    const buildInitialMemos = (highlights: typeof initHighlights) => {
        console.log("Building initial memos:", editor);
        if (!editor) return;
        for (const highlight of highlights) {
            editor?.insertInlineContent([
                {
                    type: "highlight",
                    props: highlight,
                    content: highlight.content,
                },
            ]);
        }
    };
    const initialzieBlocks: PartialBlock[] = loadFromStorage<PartialBlock[]>(
        "editorContent_id"
    ) || [
        // {
        //     type: "paragraph",
        //     content: [
        //         { type: "text", text: "Welcome to this demo!", styles: {} },
        //     ],
        // },
        {
            id: "e87ca273-75d9-45dc-b306-d97193dec6e5",
            type: "paragraph",
            props: {
                textColor: "default",
                backgroundColor: "default",
                textAlignment: "left",
            },
            content: [
                {
                    type: "text",
                    text: "Welcome t",
                    styles: {},
                },
                {
                    type: "highlight",
                    props: {
                        id: "a4e81d04-15d9-483b-9684-189029b187a4",
                        memo: "ddđ",
                        content: "o this de",
                        color: "#ffeb3b",
                        createdAt: "2025-09-22T17:50:23.301Z",
                    },
                    content: [
                        {
                            type: "text",
                            text: "o this de",
                            styles: {},
                        },
                    ],
                },
                {
                    type: "text",
                    text: "mo!",
                    styles: {},
                },
            ],
            children: [],
        },
    ];
    const editor = useCreateBlockNote({
        schema,
        initialContent: initialzieBlocks,
        uploadFile: async (file) => {
            console.log("Uploading file:", file);
            const buffer = await file.arrayBuffer();
            // convert the buffer to a base64 string
            return "/OIP.jpg";
        },
    });

    if (editor === undefined) {
        return "Loading content...";
    }

    const findHighlightInBlocks = (
        blocks: CustomBlock[],
        highlightId: string
    ): boolean => {
        for (const block of blocks) {
            if (block.content && Array.isArray(block.content)) {
                for (const content of block.content) {
                    if (
                        (content as any).type === "highlight" &&
                        (content as any).props?.id === highlightId
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const updateHighlightInBlocks = (
        blocks: CustomBlock[],
        highlightId: string,
        memo: string
    ): CustomBlock[] => {
        return blocks.map((block) => {
            if (block.content && Array.isArray(block.content)) {
                const updatedContent = block.content.map((content) => {
                    if (
                        (content as any).type === "highlight" &&
                        (content as any).props?.id === highlightId
                    ) {
                        return {
                            ...(content as any),
                            props: {
                                ...(content as any).props,
                                memo: memo,
                            },
                        };
                    }
                    return content;
                });
                return { ...block, content: updatedContent };
            }
            return block;
        }) as CustomBlock[];
    };

    const handleMemoSave = (memo: string) => {
        console.log(`Saving memo:`, memo);
        try {
            if (
                memoModal.highlightId &&
                !findHighlightInBlocks(blocks, memoModal.highlightId)
            ) {
                // This is a new highlight - insert it
                const highlightData = {
                    id: memoModal.highlightId,
                    memo: memo,
                    content: memoModal.highlightText,
                    color: "#ffeb3b",
                    createdAt: new Date().toISOString(),
                };

                editor.insertInlineContent([
                    {
                        type: "highlight",
                        props: highlightData,
                        content: memoModal.highlightText,
                    },
                ]);
                console.log(`currrent blocks:`, editor.document);
            } else {
                // This is editing existing highlight - update it
                const updatedBlocks = updateHighlightInBlocks(
                    blocks,
                    memoModal.highlightId,
                    memo
                );
                editor.replaceBlocks(editor.document, updatedBlocks);
            }

            console.log("Memo saved:", memo);

            // Here you would also save to your backend
            // await saveHighlightToBackend(memoModal.highlightId, memo);
        } catch (error) {
            console.error("Failed to save memo:", error);
            alert("Failed to save memo. Please try again.");
        }
    };

    const handleHighlight = () => {
        const selectedText = editor.getSelectedText();
        if (!selectedText) {
            alert("Please select some text first!");
            return;
        }

        // Open modal immediately for new highlight
        const highlightId = crypto.randomUUID();
        setMemoModal({
            isOpen: true,
            highlightId: highlightId,
            highlightText: selectedText,
            currentMemo: "",
        });
    };

    useEffect(() => {
        if (!debouncedValue) {
            setShowNoteIcon(false);
            return;
        }

        const selection = window.getSelection();
        console.log(`cursor selection:`, selection);
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            console.log(`selection rect:`, rect);

            // Position near the selection
            setIconPos({
                top: rect.bottom - window.scrollY,
                left: rect.right - window.scrollX - 30,
            });

            setShowNoteIcon(true);
        }
    }, [debouncedValue]);

    // useEffect(() => {
    //     buildInitialMemos(initHighlights);
    // }, []);
    return (
        <>
            <BlockNoteView
                editor={editor}
                editable={false}
                theme={"light"}
                onChange={async () => {
                    const jsonBlocks = editor.document;
                    setBlocks(jsonBlocks);
                }}
                onSelectionChange={() => {
                    console.log(`selected:`, editor.getSelectedText());
                    setSelectedText(editor.getSelectedText() || "");
                }}
                formattingToolbar={true}
                slashMenu={false}
            >
                {/* <FormattingToolbar>
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
                </FormattingToolbar> */}
            </BlockNoteView>

            <MemoModal
                isOpen={memoModal.isOpen}
                onClose={() =>
                    setMemoModal((prev) => ({ ...prev, isOpen: false }))
                }
                onSave={handleMemoSave}
                initialMemo={memoModal.currentMemo}
                highlightText={memoModal.highlightText}
            />
            {showNoteIcon && (
                <Notebook
                    className="absolute cursor-pointer text-blue-500 hover:text-blue-700 "
                    style={{ top: iconPos.top + 5, left: iconPos.left }}
                    onClick={handleHighlight}
                />
            )}
        </>
    );
};

export default RichEditor;

"use client";

import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState } from "react";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import Loading from "../loading";
import useDebounce from "@/hooks/useDebounce";
import { loadFromStorage, saveToStorage } from "@/utils/local-storage";

const RichEditor = () => {
    const [initialContent, setInitialContent] = useState<
        PartialBlock[] | undefined | "loading"
    >("loading");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const { debouncedValue: debounceBlocksValue, isSaving } = useDebounce<
        Block[]
    >(blocks, 500);

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

    const editor = useMemo(() => {
        if (initialContent === "loading") {
            return undefined;
        }
        return BlockNoteEditor.create({
            initialContent,
            uploadFile: async (file) => {
                console.log("Uploading file:", file);
                return "/OIP.jpg";
            },
        });
    }, [initialContent]);

    if (editor === undefined) {
        return "Loading content...";
    }

    return (
        <section className="border-2 border-gray-300 p-4 rounded-lg w-full">
            <BlockNoteView
                editor={editor}
                theme={"light"}
                onChange={() => {
                    const jsonBlocks = editor.document;
                    setBlocks(jsonBlocks);
                }}
            />
            <div className="w-full text-right flex items-center justify-end gap-2 mt-4">
                {isSaving && <Loading />}
                <button
                    className="border-1 border-black rounded-2xl px-2 py-1
                    hover:bg-green-200 transition-colors duration-300 cursor-pointer"
                    onClick={saveContent}
                >
                    Save Content
                </button>
            </div>
        </section>
    );
};

export default RichEditor;

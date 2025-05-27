"use client";

import * as React from "react";
import type { Value } from "@udecode/plate";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { BasicElementsPlugin } from "@udecode/plate-basic-elements/react";
import { BasicMarksPlugin } from "@udecode/plate-basic-marks/react";
import {
    type PlateElementProps,
    type PlateLeafProps,
    Plate,
    PlateLeaf,
    usePlateEditor,
} from "@udecode/plate/react";

import { BlockquoteElement } from "@/components/ui/blockquote-element";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { HeadingElement } from "@/components/ui/heading-element";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { ParagraphElement } from "@/components/ui/paragraph-element";
import { ToolbarButton } from "@/components/ui/toolbar"; // Generic toolbar button
import { mediaPlugins } from "@/components/editor/plugins/media-plugins";
import { ImageElement } from "@/components/ui/image-element";
import { dndPlugins } from "@/components/editor/plugins/dnd-plugins";

const initialValue: Value = [
    { type: "h3", children: [{ text: "Title" }] },
    { type: "blockquote", children: [{ text: "This is a quote." }] },
    {
        type: "p",
        children: [
            { text: "With some " },
            { text: "bold", bold: true },
            { text: " text for emphasis!" },
        ],
    },
];

export default function MyEditorPage() {
    const editor = usePlateEditor({
        plugins: [
            BasicElementsPlugin,
            BasicMarksPlugin,
            ...mediaPlugins,
            ...dndPlugins,
        ], // Add plugins
        value: initialValue,
        components: {
            // Element components
            blockquote: BlockquoteElement,
            p: ParagraphElement,
            h1: (props: PlateElementProps) => (
                <HeadingElement {...props} variant="h1" />
            ),
            h2: (props: PlateElementProps) => (
                <HeadingElement {...props} variant="h2" />
            ),
            h3: (props: PlateElementProps) => (
                <HeadingElement {...props} variant="h3" />
            ),
            // Mark components (from previous step)
            bold: (props: PlateLeafProps) => (
                <PlateLeaf {...props} as="strong" />
            ),
            italic: (props: PlateLeafProps) => <PlateLeaf {...props} as="em" />,
            underline: (props: PlateLeafProps) => (
                <PlateLeaf {...props} as="u" />
            ),
            // Image component - replaced with proper implementation
            img: ImageElement,
        },
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <Plate editor={editor}>
                <FixedToolbar className="flex justify-start gap-1 rounded-t-lg">
                    {/* Element Toolbar Buttons */}
                    <ToolbarButton
                        onClick={() => editor.tf.toggleBlock("h1")}
                        tooltip="Heading 1"
                    >
                        H1
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.tf.toggleBlock("h2")}>
                        H2
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.tf.toggleBlock("h3")}>
                        H3
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.tf.toggleBlock("blockquote")}
                    >
                        Quote
                    </ToolbarButton>
                    {/* Mark Toolbar Buttons */}
                    <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
                        B
                    </MarkToolbarButton>
                    <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
                        I
                    </MarkToolbarButton>
                    <MarkToolbarButton
                        nodeType="underline"
                        tooltip="Underline (⌘+U)"
                    >
                        U
                    </MarkToolbarButton>
                    {/* Image Upload Button */}
                    <ToolbarButton
                        onClick={() => {
                            const url = prompt("Enter image URL:");
                            if (url) {
                                editor.tf.insertNodes({
                                    type: "img",
                                    url,
                                    alt: prompt("Enter image alt text:") || "",
                                    children: [{ text: "" }],
                                });
                            }
                        }}
                        tooltip="Insert Image"
                    >
                        🖼️
                    </ToolbarButton>
                </FixedToolbar>
                <EditorContainer>
                    <Editor placeholder="Type your amazing content here..." />
                </EditorContainer>
            </Plate>
        </DndProvider>
    );
}

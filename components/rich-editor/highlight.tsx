// types/highlight.ts
export interface HighlightData {
    id: string;
    memo?: string;
    color?: string;
    createdAt: string;
    userId?: string;
}

// blocks/HighlightInlineContent.tsx
import { createReactInlineContentSpec } from "@blocknote/react";
import { RiStickyNoteAddLine } from "react-icons/ri";

export type TUseHighlight = {
    onOpenMemoModal: (
        highlightId: string,
        highlightText: string,
        memo: string
    ) => void;
};

export const useHighlight = ({ onOpenMemoModal }: TUseHighlight) => {
    const Highlight = createReactInlineContentSpec(
        {
            type: "highlight",
            propSchema: {
                id: {
                    default: "",
                },
                memo: {
                    default: "",
                },
                content: {
                    default: "Highlighted Text",
                },
                color: {
                    default: "#ffeb3b",
                },
                createdAt: {
                    default: "",
                },
            },
            content: "styled",
        },
        {
            render: (props) => {
                console.log("Rendering highlight with props:", props);
                const content =
                    props.inlineContent.props.content || "Highlighted Text";
                return (
                    <span
                        className="highlight-wrapper"
                        style={{
                            backgroundColor: props.inlineContent.props.color,
                            position: "relative",
                            cursor: "pointer",
                            borderRadius: "2px",
                            padding: "1px 2px",
                        }}
                        title={
                            props.inlineContent.props.memo ||
                            "Click to add memo"
                        }
                    >
                        {props.inlineContent.props.memo && (
                            <RiStickyNoteAddLine
                                className="memo-indicator"
                                style={{
                                    position: "absolute",
                                    top: "-8px",
                                    right: "-8px",
                                    fontSize: "12px",
                                    color: "#666",
                                }}
                            />
                        )}
                        <span
                            onClick={() => {
                                onOpenMemoModal(
                                    props.inlineContent.props.id,
                                    props.inlineContent.props.content,
                                    props.inlineContent.props.memo || ""
                                );
                            }}
                        >
                            {content}
                        </span>
                    </span>
                );
            },
        }
    );
    return {
        highLight: Highlight,
    };
};

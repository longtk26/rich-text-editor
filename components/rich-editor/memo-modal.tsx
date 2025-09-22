// MemoModal.tsx
import React, { useState, useEffect } from "react";

interface MemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (memo: string) => void;
    initialMemo?: string;
    highlightText: string;
}

export const MemoModal: React.FC<MemoModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialMemo = "",
    highlightText,
}) => {
    const [memo, setMemo] = useState(initialMemo);

    useEffect(() => {
        setMemo(initialMemo);
    }, [initialMemo]);

    const handleSave = () => {
        onSave(memo);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleSave();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                className="modal-content"
                style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "24px",
                    width: "90%",
                    maxWidth: "500px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3
                    style={{
                        margin: "0 0 16px 0",
                        fontSize: "18px",
                        fontWeight: "600",
                    }}
                >
                    {initialMemo ? "Edit Memo" : "Add Memo"}
                </h3>

                <div
                    className="highlighted-text"
                    style={{
                        backgroundColor: "#ffeb3b",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        marginBottom: "16px",
                        fontStyle: "italic",
                        border: "1px solid #f0f0f0",
                    }}
                >
                    "{highlightText}"
                </div>

                <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Enter your memo... (Ctrl/Cmd + Enter to save)"
                    rows={4}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        resize: "vertical",
                        minHeight: "100px",
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />

                <div
                    className="modal-actions"
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                        marginTop: "16px",
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: "8px 16px",
                            border: "1px solid #ddd",
                            backgroundColor: "white",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

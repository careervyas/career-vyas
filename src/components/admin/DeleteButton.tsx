"use client";

import { useTransition } from "react";

interface DeleteButtonProps {
    id: string;
    name: string;
    deleteAction: (formData: FormData) => Promise<void>;
}

export default function DeleteButton({ id, name, deleteAction }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    function handleClick() {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const formData = new FormData();
        formData.set("id", id);
        startTransition(() => deleteAction(formData));
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="px-3 py-1 border-2 border-black bg-[#f43f5e] text-white font-bold text-sm brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
        >
            {isPending ? "..." : "DEL"}
        </button>
    );
}

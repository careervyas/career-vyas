"use client";

interface ShareButtonsProps {
    title: string;
    path: string;
}

export default function ShareButtons({ title, path }: ShareButtonsProps) {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://careervyas.com'}${path}`;

    const shareTw = () => {
        window.open(`https://twitter.com/intent/tweet?text=Check out ${title} on Career Vyas!&url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareWa = () => {
        window.open(`https://wa.me/?text=Check out ${title} on Career Vyas: ${encodeURIComponent(url)}`, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="flex gap-2">
            <button onClick={shareTw} className="px-3 py-1.5 bg-sky-50 text-sky-600 border border-sky-200 rounded-full font-semibold text-xs hover:bg-sky-100 transition-colors">
                𝕏 / TW
            </button>
            <button onClick={shareWa} className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-full font-semibold text-xs hover:bg-green-100 transition-colors">
                WhatsApp
            </button>
            <button onClick={copyLink} className="px-3 py-1.5 bg-[var(--color-bg-soft)] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-full font-semibold text-xs hover:bg-gray-200 transition-colors">
                Copy Link
            </button>
        </div>
    );
}

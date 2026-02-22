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
            <button onClick={shareTw} className="px-3 py-2 bg-[#1DA1F2] text-white border-2 border-black font-black uppercase text-xs brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                X / TW
            </button>
            <button onClick={shareWa} className="px-3 py-2 bg-[#25D366] text-black border-2 border-black font-black uppercase text-xs brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                W-APP
            </button>
            <button onClick={copyLink} className="px-3 py-2 bg-white text-black border-2 border-black font-black uppercase text-xs brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                COPY
            </button>
        </div>
    );
}

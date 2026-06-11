import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface ShareListingButtonProps {
  eventName: string;
  price: number;
  listingId: string;
  className?: string;
}

const ShareListingButton = ({
  eventName,
  price,
  listingId,
  className,
}: ShareListingButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/availabletickets/${listingId}`;
    const message = `Selling my ticket for ${eventName} — ₹${price}. Buy here: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: eventName, text: message, url: shareUrl });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        toast.error("Could not share — try copying the link.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Could not share — try copying the link.");
      }
    }
  };

  const defaultClass =
    "flex items-center gap-1.5 border border-white/20 text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm transition-colors duration-200 cursor-pointer";

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share listing for ${eventName}`}
      className={className ?? defaultClass}
    >
      {copied ? (
        <Check size={15} aria-hidden="true" />
      ) : (
        <Share2 size={15} aria-hidden="true" />
      )}
      Share
    </button>
  );
};

export default ShareListingButton;

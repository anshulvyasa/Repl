import { Download } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";

export const CopyPlaygroundUrl = ({
  playgroundId,
}: {
  playgroundId: string;
}) => {
  const handleCopyToClipBoard = () => {
    const url = `${window.location.origin}/playground/${playgroundId}`;
    navigator.clipboard.writeText(url);
    toast.success("PlayGround URL copied to clipboard");
  };

  return (
    <DropdownMenuItem onClick={handleCopyToClipBoard}>
      <Download className="h-4 w-4 mr-2" />
      Copy URL
    </DropdownMenuItem>
  );
};

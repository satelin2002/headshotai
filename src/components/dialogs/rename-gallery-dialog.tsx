import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface RenameGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTitle: string;
  onRename: (newTitle: string) => void;
}

export function RenameGalleryDialog({
  open,
  onOpenChange,
  currentTitle,
  onRename,
}: RenameGalleryDialogProps) {
  const [newTitle, setNewTitle] = useState(currentTitle);

  const handleSubmit = () => {
    if (newTitle.trim() && newTitle.trim() !== currentTitle) {
      onRename(newTitle.trim());
      onOpenChange(false);
      toast.success("Gallery renamed successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Rename Gallery</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter a new name for your gallery
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              id="name"
              placeholder="Gallery name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white"
            onClick={handleSubmit}
            disabled={!newTitle.trim() || newTitle.trim() === currentTitle}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

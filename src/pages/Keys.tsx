
import React, { useEffect, useState } from "react";
import { getAllKeys, getKey, setKey, deleteKey } from "@/services/memcachedService";
import { MemcachedKey } from "@/types";
import { KeyList } from "@/components/keys/KeyList";
import { KeyEditor } from "@/components/keys/KeyEditor";
import { KeyViewer } from "@/components/keys/KeyViewer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, RefreshCcw, Loader2 } from "lucide-react";

export default function Keys() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<MemcachedKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<MemcachedKey | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const data = await getAllKeys();
      setKeys(data);
    } catch (error) {
      console.error("Failed to load keys:", error);
      toast({
        variant: "destructive",
        title: "Failed to load keys",
        description: "There was an error loading the keys from the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleAddNew = () => {
    setSelectedKey(null);
    setEditorOpen(true);
  };

  const handleEdit = (key: MemcachedKey) => {
    setSelectedKey(key);
    setEditorOpen(true);
    setViewerOpen(false);
  };

  const handleView = (key: MemcachedKey) => {
    setSelectedKey(key);
    setViewerOpen(true);
  };

  const handleSaveKey = async (key: MemcachedKey) => {
    try {
      const result = await setKey(key);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        fetchKeys();
        setEditorOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Failed to save key:", error);
      toast({
        variant: "destructive",
        title: "Failed to save key",
        description: "There was an error saving the key to the server.",
      });
    }
  };

  const handleDeleteRequest = (key: string) => {
    setKeyToDelete(key);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!keyToDelete) return;
    
    try {
      const result = await deleteKey(keyToDelete);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        fetchKeys();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Failed to delete key:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete key",
        description: "There was an error deleting the key from the server.",
      });
    } finally {
      setConfirmDeleteOpen(false);
      setKeyToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cache Keys</h2>
          <p className="text-muted-foreground mt-1">
            Manage and inspect cache keys
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchKeys} 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Key
          </Button>
        </div>
      </div>

      <KeyList 
        keys={keys} 
        onEdit={handleEdit} 
        onDelete={handleDeleteRequest} 
        onView={handleView} 
      />

      <KeyEditor 
        key={`editor-${selectedKey?.key || 'new'}`}
        open={editorOpen} 
        onClose={() => setEditorOpen(false)} 
        onSave={handleSaveKey} 
        key={selectedKey}
      />

      <KeyViewer 
        open={viewerOpen} 
        onClose={() => setViewerOpen(false)} 
        keyData={selectedKey} 
        onEdit={handleEdit} 
      />

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the key:
              <span className="font-mono block mt-2 p-2 bg-secondary/50 rounded">
                {keyToDelete}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} variant="destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

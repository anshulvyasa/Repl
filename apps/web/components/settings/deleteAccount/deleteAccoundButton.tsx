"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


import { finalDelete } from "./delete";
import { signOut } from "next-auth/react";


export function DeleteAccountButton() {

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationtext] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {

      setIsDeleting(true);
      await finalDelete();

      // clearing the local  data
      localStorage.clear();
      sessionStorage.clear();

      await signOut({
        callbackUrl: "/",
        redirect: true
      })

    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };


  const handleCancle = () => {
    setConfirmationtext("");
  }


  return (
    <>
      <button
        onClick={() => setDeleteDialogOpen(true)}
        className="bg-red-600 text-white font-bold px-4 py-2 rounded-md hover:bg-red-500 transition duration-200 active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
      >
        Delete Account
      </button>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot
              be undone. All your data, projects, and settings will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <label className="text-sm font-medium">
              Type <span className="font-bold text-destructive">CONFIRM</span> to proceed:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationtext(e.target.value)}
              className="w-full mt-2 px-3 py-2 border rounded-md"
              placeholder="Type CONFIRM"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
             onClick={handleCancle}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={confirmationText !== "CONFIRM" || isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
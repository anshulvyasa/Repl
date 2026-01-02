"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export const UploadButton = () => {

    const inputRef = useRef<HTMLInputElement>(null)

    const openFilePicker = () => {
        inputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 10000000) {
            toast.error("File is too large! Please upload a file smaller than 10MB.")
            e.target.value = ""
            return
        }

       
        const loadingToast = toast.loading("Uploading image...")

        try {
            
            const reader = new FileReader()

            reader.onloadend = async () => {
                try {
                    const base64String = reader.result as string

                    const res = await fetch("/api/v1/cloudinary/upload", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include", // Important for sending cookies
                        body: JSON.stringify({
                            photo: base64String
                        })
                    })

                    const data = await res.json()

                    if (!res.ok || !data.success) {
                        throw new Error(data.error || "Upload failed")
                    } 

                    toast.success("Image uploaded successfully!", { id: loadingToast })
                    console.log("Cloudinary URL:", data.data?.secure_url)

                    // Clear the input
                    e.target.value = ""
                } catch (error) {
                    console.error("Upload error:", error)
                    toast.error(error instanceof Error ? error.message : "Failed to upload image", { id: loadingToast })
                }
            }

            reader.onerror = () => {
                toast.error("Failed to read file", { id: loadingToast })
            }

            reader.readAsDataURL(file)
        }catch (error) {
            console.log("CAUGHT ERROR:", error); // ← Add this
            console.error("Upload error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to upload image", { id: loadingToast })
        }
    }
    return (
        <>
            <input
                type="file"
                ref={inputRef}
                hidden
                accept="image/*"
                onChange={handleFileChange}
            />
            <Button className="cursor-pointer"
                onClick={openFilePicker}
                size="sm"
            >
                Upload</Button>
        </>
    )
}

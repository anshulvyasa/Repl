"use client"

import { useRef} from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { uploadImage } from "./uploadButton"
import { useRouter } from "next/navigation"


export const UploadButton = () => {
    const router=useRouter()
    const inputRef  = useRef<HTMLInputElement>(null)

    const openFilePicker = () => {
        inputRef.current?.click()
    }

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("avatar", file)  

        try {
            toast.loading("Uploading image...")

            const data = await uploadImage(formData)

            toast.success("Image uploaded successfully")
            console.log(data)
            router.refresh()

        } catch (error) {
            console.error(error)
            toast.error("Failed to upload image")
        } finally {
            toast.dismiss()
            // allow same file re-selection
            e.target.value = ""
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
            <Button
                onClick={openFilePicker}
                size="sm"
                className="cursor-pointer"
            >
                Upload
            </Button>
        </>
    )
}

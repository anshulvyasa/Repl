import getUserInfo from "@/lib/get_user"

export async function uploadImage(formData: FormData) {
    const user = await getUserInfo()

    if (!user) {
        throw new Error("User not authenticated")
    }
    formData.append("userId", user.id)

    const res = await fetch("http://localhost:5000/app/v1/cloudinary/upload", {
        method: "POST",
        body: formData,
        credentials: 'include', 
    })

    if (!res.ok) {
        const errorData = await res.json()  // ← See actual error
        throw new Error(errorData.message || "Upload failed")
    }

    return res.json()
}

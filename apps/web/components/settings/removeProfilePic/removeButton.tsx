"use client"


import { removePic } from "./removePic";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default   function removePicButton(){

    const router=useRouter()

    const handleRemove=async()=>{
       const updatedUser= await removePic()
       console.log(updatedUser,"user updated") 
       router.refresh()
    }


    return (
         <Button size="sm" variant="outline" className=" cursor-pointer" onClick={handleRemove}>
                  Remove
        </Button>
    )

}
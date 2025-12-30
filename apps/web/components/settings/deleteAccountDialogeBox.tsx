import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function deleteAccountDialogeBox (){
    return(
        <Card>
            <CardHeader>
                <CardTitle>
                    <p> Permanently delete this account?</p>
                </CardTitle>
                <div className="flex flex-row">
                    <button> cancle</button>
                    <button className=" bg-red-500 text-white"> delete</button>
                </div>
            </CardHeader>

        </Card>
    )
}
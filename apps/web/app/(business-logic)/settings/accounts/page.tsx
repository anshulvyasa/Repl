import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  DeleteAccountButton} from "./deleteAccoundButton";
import { Button } from "@/components/ui/button";

import { getUserInfo } from "@/lib/get_user";

export default  async function AccountSettings() {

  const user = await getUserInfo();

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4 py-6 md:px-0">
      
      {/* Header */}
      <div className="space-y-1 text-center md:text-left">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>

      <Card>
        {/* Profile Picture Section */}
        <CardHeader>
          <CardTitle className="text-lg">Profile picture</CardTitle>
          <CardDescription>
            This will be displayed on your public profile.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              {/* Todo: Here we  need to replace it with the cloudinary optimised link */}
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex gap-2 justify-center sm:justify-start">
                <Button size="sm">Upload</Button>
                <Button size="sm" variant="outline">
                  Remove
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </CardContent>

        {/* Display Name Section */}
        <CardContent className="mt-4 border-t pt-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
            <div className="flex flex-col mr-auto">
              <h3 className="font-medium text-lg">Display Name</h3>
              <p className="text-muted-foreground text-sm">
                Your public display name
              </p>
            </div>

            <Card className="w-full md:w-64 p-3 flex items-center bg-muted/50">
              <span className="text-sm font-medium">{user?.name}</span>
            </Card>
          </div>
        </CardContent>

        {/* Email Section */}
        <CardContent className="border-t pt-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
            <div className="flex flex-col mr-auto">
              <h3 className="font-medium text-lg">Email</h3>
              <p className="text-muted-foreground text-sm">
                Your public email address
              </p>
            </div>

            <Card className="w-full md:w-64 p-3 flex items-center text-muted-foreground bg-muted/50">
              <span className="text-sm">{user?.email}</span>
            </Card>
          </div>
        </CardContent>

        {/* Delete Account Section */}
        <CardContent className="border-t pt-6">
          <DeleteAccountButton/>
        </CardContent>
      </Card>
    </div>
  );
}
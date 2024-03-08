import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from "~/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import TelegramConfig from "~components/options/telegram"
import { Toaster } from "~components/ui/toaster"
import "~style.css"

export default function OptionsIndex() {
  return (
    <div className="flex justify-center items-center m-10">
      <Tabs defaultValue="Telegram" className="w-[500px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Telegram">Telegram</TabsTrigger>
          <TabsTrigger value="ComingSoon" disabled>Coming soon</TabsTrigger>
        </TabsList>
        <TabsContent value="Telegram">
          <Card>
            <CardHeader>
              <CardDescription>
                Make changes to your telegram configuration here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TelegramConfig />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ComingSoon">
          
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}

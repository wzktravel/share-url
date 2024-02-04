import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Textarea } from "~components/ui/textarea"
import "~style.css"

function IndexPopup() {

  const [copied, setCopied] = useState(false)

  const FormSchema = z.object({
    title: z.string(),
    url: z.string(),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const markdown = `[${data.title}](${data.url})`
    navigator.clipboard.writeText(markdown)
      .then(() => {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 800);
      })
  }

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs)
      const currentTab = tabs[0];
      form.reset({ title: currentTab.title, url: currentTab.url });
    });
  }, []);

  return (
    <div className="container w-96 px-4 py-4">
      <div className="flex items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-slate-100 min-h-16"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-slate-100 min-h-16"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <TooltipProvider>
                <Tooltip
                  open={copied}
                >
                  <TooltipTrigger asChild>
                    <Button type="submit">Copy As Markdown</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copied!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default IndexPopup

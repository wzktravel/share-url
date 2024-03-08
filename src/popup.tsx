import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Alert, AlertDescription } from "~components/ui/alert"
import { Label } from "~components/ui/label"
import { Textarea } from "~components/ui/textarea"
import "~style.css"

function IndexPopup() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [telegramConfigError, setTelegramConfigError] = useState(false)  // 配置是否正确

  const copyAsMarkdown = function () {
    const markdown = `[${title}](${url})`
    navigator.clipboard.writeText(markdown)
      .then(() => {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 800);
      })
  }

  async function shareToTelegram() {
    const items = await chrome.storage.sync.get("config.telegram");
    let channelId = items['config.telegram']['channel_id']
    let botToken = items['config.telegram']['bot_token']
    if (!channelId || !botToken) {
      setTelegramConfigError(true)
      return;
    }

    const text = `${title}\nURL: ${url}`
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
    axios
      .post(apiUrl, {
        chat_id: channelId,
        text: text
      })
      .then((response) => {
        setShared(true)
        setTimeout(() => {
          setShared(false)
        }, 800);
      })
      .catch(error => {
        console.error(error);
        setTelegramConfigError(true)
      });
  }

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      setTitle(currentTab.title);
      setUrl(currentTab.url);
    });
  }, []);

  return (
    <div className="container w-96 px-4 py-4">
      <div className="flex items-center justify-center">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Textarea
            className="bg-slate-100 min-h-16"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Label htmlFor="url">Url</Label>
          <Textarea
            className="bg-slate-100 min-h-16"
            id="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />

          <div className="flex space-x-2 justify-end">
            <TooltipProvider>
              <Tooltip
                open={shared}
              >
                <TooltipTrigger asChild>
                  <Button onClick={shareToTelegram}>Share To Telegram</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shared!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip
                open={copied}
              >
                <TooltipTrigger asChild>
                  <Button onClick={copyAsMarkdown}>Copy As Markdown</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copied!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Alert variant="destructive" className={telegramConfigError ? "block" : "hidden"}>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              Telegram config error, please go to <Button variant="link" onClick={() => {chrome.runtime.openOptionsPage()}}>Options Page</Button> to check configuration.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup

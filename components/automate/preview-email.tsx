import { Template } from "@/types/templates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { useState } from "react"

interface PreviewEmailProps {
  template: Template | undefined
  previewData: Record<string, string>
  fieldMappings: Record<string, string>
  onSendEmails: () => Promise<void>
}

export function PreviewEmail({
  template,
  previewData,
  fieldMappings,
  onSendEmails,
}: PreviewEmailProps) {
  const [sending, setSending] = useState(false)

  const renderContent = () => {
    if (!template) return ''

    let content = template.content
    Object.entries(fieldMappings).forEach(([placeholder, csvField]) => {
      const value = previewData[csvField] || ''
      content = content.replace(new RegExp(`{{${placeholder}}}`, 'g'), value)
    })
    return content
  }

  const handleSend = async () => {
    setSending(true)
    try {
      await onSendEmails()
    } finally {
      setSending(false)
    }
  }

  if (!template) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a template to preview the email
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Email Preview</CardTitle>
        <Button
          onClick={handleSend}
          disabled={sending}
          className="bg-[#FF6C37] hover:bg-[#FF6C37]/90"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {sending ? 'Sending...' : 'Send Emails'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Subject</h3>
            <p className="text-muted-foreground">{template.subject}</p>
          </div>
          <div>
            <h3 className="font-semibold">From</h3>
            <p className="text-muted-foreground">{template.from_name}</p>
          </div>
          <div>
            <h3 className="font-semibold">Content</h3>
            <div
              className="p-4 rounded-lg bg-muted/50 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderContent() }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
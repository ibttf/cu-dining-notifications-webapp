// app/page.tsx
"use client"
import React, { useState } from "react"
import EmailSubscriptionForm, {
  SubscriptionData
} from "./(components)/EmailSubscriptionForm"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

async function saveSubscription(data: SubscriptionData): Promise<string> {
  try {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      if (response.status === 400) {
        return "invalid_email"
      }
      return "error"
    }
    return "success"
  } catch (error) {
    return "error"
  }
}

async function handleUnsubscribe(email: string): Promise<string> {
  const response = await fetch("/api/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
  if (response.status === 404) {
    return "not_found"
  }
  return response.ok ? "success" : "error"
}

const Page: React.FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [showUnsubscribe, setShowUnsubscribe] = useState(false)
  const [unsubEmail, setUnsubEmail] = useState("")
  const [isUnsubLoading, setIsUnsubLoading] = useState(false)
  const [isSubLoading, setIsSubLoading] = useState(false)

  const handleSubscribeSubmit = async (data: SubscriptionData) => {
    setIsSubLoading(true)
    const result = await saveSubscription(data)
    setIsSubLoading(false)

    switch (result) {
      case "success":
        toast({
          title: "Success!",
          description:
            "You've been subscribed / updated your preferences successfully. Expect emails starting tomorrow at 7am!"
        })
        break
      case "invalid_email":
        toast({
          title: "Invalid Email",
          description: "Please use your personal email address.",
          variant: "destructive"
        })
        break
      case "error":
        toast({
          title: "Error",
          description: "There was an error subscribing. Please try again.",
          variant: "destructive"
        })
        break
    }
  }

  const handleUnsubscribeClick = async () => {
    if (!unsubEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      })
      return
    }

    setIsUnsubLoading(true)
    const result = await handleUnsubscribe(unsubEmail)
    setIsUnsubLoading(false)

    switch (result) {
      case "success":
        toast({
          title: "Success",
          description: "You have been successfully unsubscribed."
        })
        setUnsubEmail("")
        setShowUnsubscribe(false)
        break
      case "not_found":
        toast({
          title: "Not Found",
          description: "email not subscribed",
          variant: "destructive"
        })
        break
      case "error":
        toast({
          title: "Error",
          description: "There was an error unsubscribing. Please try again.",
          variant: "destructive"
        })
        break
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          No more 'dining.columbia.edu.' Just get an email
        </h1>
        <p className="text-center mb-6">
          put in your personal email + preferences. emails at 7am every day.
        </p>
        {!showUnsubscribe ? (
          <>
            <EmailSubscriptionForm
              onSubmit={handleSubscribeSubmit}
              isLoading={isSubLoading}
            />
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setShowUnsubscribe(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                Want to unsubscribe?
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Unsubscribe</h2>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={unsubEmail}
                onChange={(e) => setUnsubEmail(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={handleUnsubscribeClick}
                disabled={isUnsubLoading}
              >
                {isUnsubLoading ? "Unsubscribing..." : "Unsubscribe"}
              </Button>
            </div>
            <Button
              variant="link"
              onClick={() => setShowUnsubscribe(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to subscription form
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Page

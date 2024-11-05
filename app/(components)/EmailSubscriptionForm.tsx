// components/EmailSubscriptionForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .refine((email) => !email.endsWith("@columbia.edu"), {
      message: "Please use your personal email"
    }),
  isVegan: z.boolean(),
  isVegetarian: z.boolean(),
  isHalal: z.boolean(),
  allergens: z.array(z.string()).optional()
})

export type SubscriptionData = z.infer<typeof formSchema>

interface PreferencesFormProps {
  onSubmit: (data: SubscriptionData) => Promise<void>
}

export function EmailSubscriptionForm({ onSubmit }: PreferencesFormProps) {
  const form = useForm<SubscriptionData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      isVegan: false,
      isVegetarian: false,
      isHalal: false,
      allergens: []
    }
  })

  const [allergens, setAllergens] = useState<string[]>([])

  const handleAllergenChange = (allergen: string) => {
    setAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((item) => item !== allergen)
        : [...prev, allergen]
    )
    form.setValue("allergens", allergens)
  }

  const handleSubmit = async (data: SubscriptionData) => {
    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 max-w-lg mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your personal email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isVegan"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <FormLabel>vegan</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isVegetarian"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <FormLabel>vegetarian</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isHalal"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <FormLabel>halal</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Allergens</FormLabel>
          <div className="space-y-2">
            {["peanuts", "shellfish", "gluten", "dairy", "soy"].map(
              (allergen) => (
                <div key={allergen} className="flex items-center space-x-2">
                  <Checkbox
                    checked={allergens.includes(allergen)}
                    onCheckedChange={() => handleAllergenChange(allergen)}
                  />
                  <FormLabel>{allergen}</FormLabel>
                </div>
              )
            )}
          </div>
          <FormMessage />
        </FormItem>

        <Button type="submit" className="w-full">
          subscribe
        </Button>
      </form>
    </Form>
  )
}

export default EmailSubscriptionForm

"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {navigateToBuilder} from "@/lib/actions";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please select a strategy.",
    })
})

export function SelectForm({setLoading}: { setLoading: Function }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    // Sleep for 300 ms (delay)
    await new Promise((resolve) => setTimeout(resolve, 300))
    await navigateToBuilder()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 md:w-1/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Structure optimisation:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select what type of structure optimisation do you need"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Tax optimisation</SelectItem>
                  <SelectItem value="2">Cost of structure</SelectItem>
                  <SelectItem value="3">Legality</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can change this settings later
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">Submit</Button>
      </form>
    </Form>
  )
}

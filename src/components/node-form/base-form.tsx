import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "@/common/store/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function getFormSchema(mappedTypes: string[]) {
  return z.object({
    nodeNamed: z.string().min(2, {
      message: "Node name must be at least 2 characters.",
    }),
    nodeType: z.custom<string>(
      (val) => {
        return typeof val === "string" && mappedTypes.includes(val);
      },
      {
        message: "Invalid node type.",
      },
    ),
  });
}

export function BaseNodeForm() {
  const companyOrgFormsTypes = useStore((state) => state.companyOrgFormsTypes);
  const selectedNode = useStore((state) => state.selectedNode);
  const editSelectedNode = useStore((state) => state.editSelectedNode);
  const mappedCompanyTypes: string[] = companyOrgFormsTypes.map((type) => {
    return type.name.toLowerCase() === "llc"
      ? type.name.toUpperCase()
      : type.name;
  });

  const formSchema = getFormSchema(mappedCompanyTypes);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nodeNamed: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (selectedNode) {
      console.log("Editing node");
      editSelectedNode(data.nodeNamed, "");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="nodeNamed"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-2 py-2 items-center">
                <FormLabel>Node name</FormLabel>
              </div>
              <FormControl>
                <Input type="text" placeholder="Node name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nodeType"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-2 py-2 items-center">
                <FormLabel>Node type</FormLabel>
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mappedCompanyTypes.map((companyType, id) => (
                    <SelectItem key={id} value={companyType}>
                      {companyType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

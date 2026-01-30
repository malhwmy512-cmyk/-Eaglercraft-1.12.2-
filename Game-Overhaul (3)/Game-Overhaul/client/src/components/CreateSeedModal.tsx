import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSeedSchema, type CreateSeedRequest } from "@shared/schema";
import { useCreateSeed } from "@/hooks/use-seeds";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";

export function CreateSeedModal() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const mutation = useCreateSeed();

  const form = useForm<CreateSeedRequest>({
    resolver: zodResolver(insertSeedSchema),
    defaultValues: {
      name: "",
      seedValue: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: CreateSeedRequest) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Seed Archived",
          description: "Your discovery has been added to the database.",
          className: "bg-primary text-primary-foreground",
        });
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Failed to Archive",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cyber-button bg-primary text-primary-foreground font-bold uppercase">
          <Plus className="mr-2 h-4 w-4" />
          Log New Seed
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-widest text-primary">NEW DISCOVERY LOG</DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono">
            Enter the details of the world generation seed you found.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground">Designation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Iron Peaks" {...field} className="bg-black/40 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="seedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground">Seed Value</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. -8291038192" {...field} className="bg-black/40 border-white/10 font-mono text-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground">Terrain Analysis</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe biomes, resources, and structures..." 
                      className="bg-black/40 border-white/10 min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-muted-foreground">Visual Evidence (URL) - Optional</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} className="bg-black/40 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase mt-4"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Log Entry"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

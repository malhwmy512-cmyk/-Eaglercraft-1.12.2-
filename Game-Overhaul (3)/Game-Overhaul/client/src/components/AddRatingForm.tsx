import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRatingSchema, type CreateRatingRequest } from "@shared/schema";
import { useCreateRating } from "@/hooks/use-seeds";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RatingStars } from "./RatingStars";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddRatingFormProps {
  seedId: number;
  onSuccess?: () => void;
}

export function AddRatingForm({ seedId, onSuccess }: AddRatingFormProps) {
  const { toast } = useToast();
  const mutation = useCreateRating(seedId);

  const form = useForm<CreateRatingRequest>({
    resolver: zodResolver(insertRatingSchema),
    defaultValues: {
      score: 5,
      comment: "",
    },
  });

  const onSubmit = (data: CreateRatingRequest) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Rating Submitted",
          description: "Thank you for contributing to the archive.",
          className: "bg-primary text-primary-foreground",
        });
        form.reset();
        onSuccess?.();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-card/30 p-4 rounded-lg border border-white/5">
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Rating Score</FormLabel>
              <FormControl>
                <div className="py-2">
                  <RatingStars 
                    rating={field.value} 
                    onRate={field.onChange}
                    size="lg"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Observation Log</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your findings in this world..." 
                  className="bg-black/40 border-white/10 focus:border-primary/50 min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider"
        >
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Analysis"}
        </Button>
      </form>
    </Form>
  );
}

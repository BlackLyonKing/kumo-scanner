import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Verified } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Testimonial {
  id: string;
  wallet_address: string;
  display_name: string;
  avatar_url: string | null;
  rating: number;
  comment: string;
  verified_trader: boolean;
  created_at: string;
  is_featured: boolean;
}

const Testimonials = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Testimonial[];
    },
  });

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Loading testimonials...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-6 w-6 text-warning fill-warning" />
          Trader Testimonials
        </CardTitle>
        <CardDescription>
          Real feedback from traders using B.L.K Trading Tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar_url || undefined} />
                    <AvatarFallback>
                      {testimonial.display_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{testimonial.display_name}</p>
                        {testimonial.verified_trader && (
                          <Verified className="h-4 w-4 text-primary fill-primary" />
                        )}
                      </div>
                      <div className="flex">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-warning fill-warning"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.comment}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(testimonial.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                      {testimonial.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Testimonials;

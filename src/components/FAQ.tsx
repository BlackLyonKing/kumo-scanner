import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
}

const FAQ = () => {
  const { data: faqItems, isLoading } = useQuery({
    queryKey: ["faq-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .order("category", { ascending: true })
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as FAQItem[];
    },
  });

  const categories = Array.from(new Set(faqItems?.map((item) => item.category) || []));

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Loading FAQ...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <CardTitle>Frequently Asked Questions</CardTitle>
        </div>
        <CardDescription>
          Find answers to common questions about B.L.K Trading Tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categories.map((category) => (
          <div key={category} className="mb-6 last:mb-0">
            <Badge variant="outline" className="mb-3">
              {category}
            </Badge>
            <Accordion type="single" collapsible className="w-full">
              {faqItems
                ?.filter((item) => item.category === category)
                .map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FAQ;

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Droplets, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const IrrigationWidget = () => {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const { toast } = useToast();

  const getRecommendation = async () => {
    if (!pincode) {
      toast({
        title: "Missing information",
        description: "Please enter your PIN code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("irrigation-advisor", {
        body: { pincode },
      });

      if (error) throw error;
      
      setRecommendation(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get recommendation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-soft hover:shadow-hover transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <CardTitle>Irrigation Advisor</CardTitle>
        </div>
        <CardDescription>Smart watering recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="irrigation-pincode">PIN Code</Label>
          <Input
            id="irrigation-pincode"
            placeholder="Enter PIN code"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <Button onClick={getRecommendation} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Get Recommendation"
          )}
        </Button>

        {recommendation && (
          <div className="space-y-3 pt-2 border-t">
            <div className={`flex items-start gap-2 ${recommendation.shouldWater ? 'text-blue-600' : 'text-green-600'}`}>
              {recommendation.shouldWater ? (
                <AlertCircle className="h-5 w-5 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {recommendation.shouldWater ? "Irrigation Recommended" : "No Irrigation Needed"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {recommendation.reason}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IrrigationWidget;

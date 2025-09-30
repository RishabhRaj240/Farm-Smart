import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Camera } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const CropIdentifier = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setAnalysis("");
    };
    reader.readAsDataURL(file);
  };

  const analyzeCrop = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("crop-identifier", {
        body: { 
          image,
          location: location.trim() || undefined
        },
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Crop information retrieved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze crop",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-accent" />
          <CardTitle>Crop Identifier</CardTitle>
        </div>
        <CardDescription>
          Upload a photo of your crop to get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Location (Optional)</label>
          <Input
            placeholder="Enter your location for weather-based watering tips"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <label
              htmlFor="crop-image"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
            >
              {image ? (
                <img
                  src={image}
                  alt="Uploaded crop"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or WEBP (MAX. 5MB)
                  </p>
                </div>
              )}
              <input
                id="crop-image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
            </label>
          </div>

          <Button
            onClick={analyzeCrop}
            disabled={!image || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Identify Crop
              </>
            )}
          </Button>
        </div>

        {analysis && (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-muted/30">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Analysis Results:</h3>
              <p className="text-sm whitespace-pre-wrap">{analysis}</p>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default CropIdentifier;

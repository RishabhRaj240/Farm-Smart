import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Cloud, Loader2, MapPin, Thermometer, Droplets, Wind } from "lucide-react";

const WeatherWidget = () => {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const { toast } = useToast();

  const fetchWeather = async () => {
    if (!pincode || pincode.length < 4) {
      toast({
        title: "Invalid PIN code",
        description: "Please enter a valid PIN code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-weather", {
        body: { pincode },
      });

      if (error) throw error;
      
      setWeatherData(data);
      toast({
        title: "Weather updated",
        description: `Weather data for ${pincode} loaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch weather data",
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
          <Cloud className="h-5 w-5 text-primary" />
          <CardTitle>Weather Information</CardTitle>
        </div>
        <CardDescription>Check weather by PIN code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter PIN code"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            disabled={loading}
          />
          <Button onClick={fetchWeather} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
          </Button>
        </div>

        {weatherData && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{weatherData.location}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span>{weatherData.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span>{weatherData.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wind className="h-4 w-4 text-gray-500" />
                <span>{weatherData.windSpeed} km/h</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Cloud className="h-4 w-4 text-gray-500" />
                <span className="capitalize">{weatherData.condition}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;

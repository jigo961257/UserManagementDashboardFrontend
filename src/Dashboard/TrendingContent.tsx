import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardData } from "@/api/login/action"; // 🟠 Replace with actual function

export default function TrendingContent() {
  const [activeTab, setActiveTab] = useState<"posts" | "videos">("posts");

  const [postItems, setPostItems] = useState([]);
  const [videoItems, setVideoItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingContent() {
      const result = await DashboardData(); // ✅ Call your actual API function
      console.log("Trending API result:", result);

      if (result?.data) {
        setPostItems(result.data.
trendingContent.posts || []);
        setVideoItems(result.data.
trendingContent.videos || []);
      }

      setLoading(false);
    }

    fetchTrendingContent();
  }, []);

  const content = activeTab === "posts" ? postItems : videoItems;

  if (loading) {
    return <div className="text-center mt-4">Loading trending content...</div>;
  }

  return (
    <div className="p-4 ml-1 mr-6">
      <h2 className="text-2xl font-medium mb-1">Trending Content</h2>
      <p className="text-sm font-medium mb-4">
        Based on Likes/Comments
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "posts"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
              : "bg-gray-200 text-black"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "videos"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
              : "bg-gray-200 text-black"
          }`}
        >
          Videos
        </button>
      </div>

      {/* Carousel */}
      <div
        className="bg-orange-100 rounded-md"
        style={{
          paddingLeft: "60px",
          paddingRight: "60px",
          boxShadow: "0 4px 6px -1px rgba(79, 79, 77, 0.2)",
        }}
      >
        <Carousel className="w-full max-w-4xl mx-auto p-5">
          <CarouselContent className="-ml-2 md:-ml-4">
            {content.map((item, idx) => (
              <CarouselItem
                key={idx}
                className="md:basis-1/2 lg:basis-1/3 pl-2 md:pl-4"
              >
                <Card className="overflow-hidden">
                  <CardContent className="">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[225px] object-fit rounded-sm"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// Mock data
const postItems = [
  { title: "Black Lives Matter", image: "/images/black.jpg" },
  { title: "Labour Day", image: "/images/labour.jpg" },
  { title: "Juneteenth", image: "/images/juneteenth.jpg" },
  { title: "Juneteenth", image: "/images/juneteenth.jpg" },
  { title: "Juneteenth", image: "/images/juneteenth.jpg" },
];

const videoItems = [
  { title: "Republic Day", image: "/images/republic.jpg" },
  { title: "Freedom Speech", image: "/images/freedom.jpg" },
  { title: "Independence", image: "/images/independence.jpg" },
];

export default function TrendingContent() {
  const [activeTab, setActiveTab] = useState<"posts" | "videos">("posts");

  const content = activeTab === "posts" ? postItems : videoItems;

  return (
    <div className="p-4 ml-6 mr-6 ">
      <h2 className="text-2xl font-semibold mb-1">Trending Content</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Based on Likes/Comments
      </p>

      {/* Tab buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 rounded-md  font-medium ${
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
      <div className="bg-orange-100 rounded-md " style={{paddingLeft:"60px",paddingRight:"60px",    boxShadow: "0 4px 6px -1px rgba(79, 79, 77, 0.2)", // light orange shadow
}}>

      <Carousel className="w-full max-w-6xl mx-auto p-5 ">
        <CarouselContent className="-ml-2 md:-ml-4">
          {content.map((item, idx) => (
            <CarouselItem
              key={idx}
              className="md:basis-1/2 lg:basis-1/3 pl-2 md:pl-4"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[200px] object-cover rounded-sm"
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

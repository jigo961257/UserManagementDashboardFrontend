import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    title: "Black Lives Matter",
    image: "/images/black.jpg",
  },
  {
    title: "Labour Day",
    image: "/images/labour.jpg",
  },
  {
    title: "Juneteenth",
    image: "/images/juneteenth.jpg",
  },
   {
    title: "Black Lives Matter",
    image: "/images/black.jpg",
  },
  {
    title: "Labour Day",
    image: "/images/labour.jpg",
  },
  {
    title: "Juneteenth",
    image: "/images/juneteenth.jpg",
  },
];

const Carsoul = () => {
  return (
    <div className="px-4">
      <Carousel className="w-full max-w-6xl mx-auto">
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item, idx) => (
            <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3 pl-2 md:pl-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[250px] object-cover"
                  />
                </CardContent>
              </Card>
              <p className="mt-2 text-center font-medium">{item.title}</p>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation buttons (they go after CarouselContent) */}
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Carsoul;

import { Clock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CourseCardProps {
  id: string;
  title: string;
  image: string;
  duration: string;
  level: string;
  price?: string;
}

export const CourseCard = ({ id, title, image, duration, level, price }: CourseCardProps) => {
  return (
    <Link to={`/courses/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base line-clamp-2 mb-3">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration} Hours</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>{level}</span>
            </div>
          </div>
        </CardContent>
        {price && (
          <CardFooter className="px-4 pb-4 pt-0">
            <p className="text-lg font-bold text-accent">{price}</p>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

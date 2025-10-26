import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

export default function AddCourse() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 bg-secondary">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-8">Add Course</h1>

          <div className="bg-background rounded-lg border p-6 space-y-6">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" placeholder="Type here" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="headings">Course Headings</Label>
              <Input id="headings" placeholder="Type here" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea id="description" placeholder="Type here" className="mt-2 min-h-32" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price">Course Price</Label>
                <Input id="price" type="number" placeholder="0" className="mt-2" />
              </div>

              <div>
                <Label>Course Thumbnail</Label>
                <div className="mt-2 flex gap-2">
                  <Button variant="default" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 border rounded-md flex items-center justify-center bg-secondary h-10">
                    <span className="text-sm text-muted-foreground">No file chosen</span>
                  </div>
                </div>
              </div>
            </div>

            <Button className="mt-6">ADD</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

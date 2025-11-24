import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { taskTemplates, TaskTemplate } from "@/data/taskTemplates";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateSelectorProps {
  onSelectTemplate: (template: TaskTemplate) => void;
}

export const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);

  const handleSelectTemplate = (template: TaskTemplate) => {
    setSelectedTemplate(template);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setOpen(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Use Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose a Task Template</DialogTitle>
          <DialogDescription>
            Select a template to quickly add a set of related tasks
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[600px] pr-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {taskTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate?.id === template.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{template.icon}</span>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Includes {template.tasks.length} tasks:
                    </p>
                    <ul className="space-y-1">
                      {template.tasks.map((task, index) => (
                        <li key={index} className="text-sm text-foreground">
                          • {task.title}
                          {task.duration && (
                            <span className="text-muted-foreground">
                              {" "}
                              ({task.duration})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedTemplate}>
            Add {selectedTemplate?.tasks.length || 0} Tasks
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

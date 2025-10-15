"use client";

import { TemplateOption } from "@/types";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Check,
  ChevronRight,
  Clock,
  Code,
  Globe,
  Plus,
  Search,
  Server,
} from "lucide-react";
import Image from "next/image";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { useDialogSelectorAndDispatcher } from "@/lib/redux/selectoranddispatcher/useDialogSelectorandDispatcher";
import { useSelectedTemplate } from "@/lib/redux/selectoranddispatcher/useSelectedTemplate";

interface TemplateProps {
  templates: TemplateOption[];
  setStep: React.Dispatch<React.SetStateAction<"select" | "configure">>;
}

export const Templates = ({ templates, setStep }: TemplateProps) => {
  // const [selectedTemplate, setSelectedTemplate] = useState<string | null>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [category, setCategory] = useState<
    "all" | "frontend" | "backend" | "fullstack"
  >("all");
  const { closeDialog } = useDialogSelectorAndDispatcher();
  const { getSelectedTemplateData, updateSelectedProjectTemplate } =
    useSelectedTemplate();

  const filteredTemplate = templates.filter((template) => {
    const matchTemplate =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchCategory = category === "all" || category === template.category;

    return matchCategory && matchTemplate;
  });

  const handleContinue = () => {
    setStep("configure");
  };

  const handleTemplateSelected = (template: TemplateOption) => {
    updateSelectedProjectTemplate(template);
  };

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-[#e93f3f] flex items-center gap-2">
          <Plus size={24} className="text-[#e93f3f]" />
          Select a Template
        </DialogTitle>
        <DialogDescription>
          Choose a template to create your new playground
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Box  */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 outline-none"
              size={18}
            />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs
            defaultValue="all"
            className="w-full sm:w-auto"
            onValueChange={(value) => setCategory(value as any)}
          >
            <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="fullstack">Fullstack</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <RadioGroup value={getSelectedTemplateData.template?.id || ""}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplate.length > 0 ? (
              filteredTemplate.map((template) => (
                <div
                  key={template.id}
                  className={`relative flex p-6 border rounded-lg cursor-pointer
                          transition-all duration-300 hover:scale-[1.02]
                          ${
                            getSelectedTemplateData.template?.id === template.id
                              ? "border-[#E93F3F]  shadow-[0_0_0_1px_#E93F3F,0_8px_20px_rgba(233,63,63,0.15)]"
                              : "hover:border-[#E93F3F] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
                          }`}
                  onClick={() => handleTemplateSelected(template)}
                >
                  {getSelectedTemplateData.template?.id === template.id && (
                    <div className="absolute top-2 left-2 bg-[#E93F3F] text-white rounded-full p-1">
                      <Check size={14} />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <div
                      className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: `${template.color}15` }}
                    >
                      {/* Todo: replace it with Lucied React in Future */}
                      <Image
                        src={template.icon || "/placeholder.svg"}
                        alt={`${template.name} icon`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">
                          {template.name}
                        </h3>
                        <div className="flex gap-1">
                          {template.category === "frontend" && (
                            <Code size={14} className="text-blue-500" />
                          )}
                          {template.category === "backend" && (
                            <Server size={14} className="text-green-500" />
                          )}
                          {template.category === "fullstack" && (
                            <Globe size={14} className="text-purple-500" />
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {template.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 border rounded-2xl"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <RadioGroupItem
                    value={template.id}
                    id={template.id}
                    className="sr-only"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                <Search size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No templates found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock size={14} className="mr-1" />
          <span>
            Estimated setup time:{" "}
            {getSelectedTemplateData.template
              ? "2-5 minutes"
              : "Select a template"}
          </span>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              closeDialog();
              updateSelectedProjectTemplate(null);
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#E93F3F] hover:bg-[#d03636]"
            disabled={!getSelectedTemplateData.template}
            onClick={handleContinue}
          >
            Continue <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

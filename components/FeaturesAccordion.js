"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const features = [
  {
    title: "Ready-made Components",
    description: "Over 100+ customizable UI components to speed up your development.",
  },
  {
    title: "API Integration",
    description: "Seamlessly connect with popular APIs and services.",
  },
  {
    title: "Responsive Design",
    description: "Ensure your app looks great on all devices with our responsive templates.",
  },
  {
    title: "Authentication",
    description: "Secure user authentication and authorization out of the box.",
  },
  {
    title: "Database Solutions",
    description: "Choose from SQL or NoSQL database options for your data needs.",
  },
  {
    title: "Deployment Assistance",
    description: "One-click deployment to popular hosting platforms.",
  },
];

const FeaturesAccordion = () => {
  return (
    <section className="bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">All you need to ship your startup fast and get profitable</h2>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {features.map((feature, index) => (
              <AccordionItem key={feature.title} value={`item-${index}`}>
                <AccordionTrigger>{feature.title}</AccordionTrigger>
                <AccordionContent>{feature.description}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;

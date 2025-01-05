"use client"; // If you're using Next.js App Router and need client-side interactivity
import React, { useState } from "react";
import { blogPosts } from "./data";
import { TitleSection } from "../TitleSection";

// Import Drawer components from shadcn/ui
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

export default function BlogList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<{
    slug: string;
    title: string;
    excerpt: string;
    content: string;
  } | null>(null);

  function handleOpenDrawer(post: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
  }) {
    setSelectedPost(post);
    setIsOpen(true);
  }

  function handleCloseDrawer() {
    setIsOpen(false);
  }

  return (
    <section
      className={`relative bg-brand-background-1 text-brand-gray-light min-h-screen py-8 transition-transform duration-500 ${isOpen ? "scale-95 blur-sm" : "scale-100 blur-0"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <TitleSection
          subtitle="Your Guide"
          title="Posts & Articles"
          className="mb-20 mt-16"
        />

        {/* Blog Posts List */}
        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              onClick={() => handleOpenDrawer(post)}
              className="border border-brand-gray-darkest hover:border-white bg-brand-background-2 rounded-lg p-6 cursor-pointer transition"
            >
              <h2 className="text-3xl font-semibold text-white mb-2">
                {post.title}
              </h2>
              <p className="text-brand-gray-medium font-mulish">
                {post.excerpt}
              </p>
              <span className="inline-block mt-4 text-brand-orange hover:underline">
                Read More &rarr;
              </span>
            </article>
          ))}
        </div>
      </div>

      {/* Drawer Component */}
      <Drawer open={isOpen} onOpenChange={handleCloseDrawer}>
        {/* 
          We add:
          - "px-6 py-4" for comfortable space around content
          - "max-w-4xl mx-auto" to limit width for better reading 
          - "h-[80vh]" to set the drawer's height at 80% of viewport
        */}
        <DrawerContent className="bg-brand-background-2 border-brand-gray-darkest h-[80vh] flex flex-col px-6 py-4 max-w-4xl mx-auto">
          <DrawerHeader className="mb-4">
            <DrawerTitle className="text-white text-3xl">
              {selectedPost?.title ?? "Post Title"}
            </DrawerTitle>
            <DrawerDescription className="text-brand-gray-medium font-mulish">
              {selectedPost?.excerpt ?? "Post excerpt..."}
            </DrawerDescription>
          </DrawerHeader>

          {/* The scrollable content area */}
          <div className="flex-1 overflow-y-auto text-brand-gray-light font-mulish">
            <div
              dangerouslySetInnerHTML={{
                __html: selectedPost?.content ?? "",
              }}
            />
          </div>

          <DrawerFooter className="flex justify-end space-x-2 pt-4">
            <DrawerClose className="text-sm bg-brand-orange px-4 py-2 rounded hover:bg-orange-600 transition-colors">
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  );
}

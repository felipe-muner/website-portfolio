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
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";

export default function BlogList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<{
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
  } | null>(null);

  function handleOpenDrawer(post: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
  }) {
    setSelectedPost(post);
    setIsOpen(true);
  }

  function handleCloseDrawer() {
    setIsOpen(false);
  }

  // Sort blog posts by date descending
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section
      className={`relative bg-brand-background-1 text-brand-gray-light min-h-screen py-8 pb-52 transition-transform duration-500 ${isOpen ? "scale-95 blur-sm" : "scale-100 blur-0"
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
          {sortedPosts.map((post) => (
            <article
              key={post.slug}
              onClick={() => handleOpenDrawer(post)}
              className="group border border-brand-gray-darkest hover:border-white bg-brand-background-2 p-6 cursor-pointer transition"
            >
              <p className="text-sm text-brand-gray-medium mb-1 group-hover:text-white">
                Published on {post.date}
              </p>
              <h2 className="text-3xl font-semibold text-white mb-2 group-hover:text-white">
                {post.title}
              </h2>
              <p className="text-brand-gray-medium font-mulish group-hover:text-white">
                {post.excerpt}
              </p>
              <Button className="font-mulish mt-4 px-4 py-2 rounded-none  bg-transparent border border-brand-orange text-brand-orange transition group-hover:bg-brand-orange group-hover:text-white">
                Read More &rarr;
              </Button>
            </article>
          ))}
        </div>
      </div>

      {/* Drawer Component */}
      <Drawer open={isOpen} onOpenChange={handleCloseDrawer}>
        <DrawerContent className="bg-brand-background-2 border-brand-gray-darkest h-[80vh] flex flex-col px-6 py-4 max-w-4xl mx-auto">
          <DrawerHeader className="mb-4">
            <DrawerTitle className="text-white text-3xl">
              {selectedPost?.title ?? "Post Title"}
            </DrawerTitle>

            {/* Include the Date + Excerpt in Drawer */}
            <div className="text-brand-gray-medium font-mulish">
              <div className="mb-2">
                Published on {selectedPost?.date ?? "Unknown date"}
              </div>
              {selectedPost?.excerpt ?? "Post excerpt..."}
            </div>
          </DrawerHeader>

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

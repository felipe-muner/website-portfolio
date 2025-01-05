"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { blogPosts, BlogPost } from "./data";
import { TitleSection } from "../TitleSection";
import { Button } from "../ui/button";

const BlogList: React.FC = () => {
  const router = useRouter();

  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handlePostClick = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  return (
    <section className="bg-brand-background-1 text-brand-gray-light min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <TitleSection
          subtitle="Your Guide"
          title="Posts & Articles"
          className="mb-20 mt-16"
        />

        <div className="grid gap-8">
          {sortedPosts.map((post: BlogPost) => (
            <article
              key={post.slug}
              onClick={() => handlePostClick(post.slug)}
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
              <Button className="mt-4 px-4 py-2 bg-transparent border border-brand-orange text-brand-orange transition group-hover:bg-brand-orange group-hover:text-white rounded-none">
                Read More &rarr;
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogList;

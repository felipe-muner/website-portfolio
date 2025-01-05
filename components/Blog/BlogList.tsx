// BlogList.tsx
import React from "react";
import { blogPosts } from "./data";
import { TitleSection } from "../TitleSection";
// Be sure to update the import path for TitleSection based on your directory structure

export default function BlogList() {
  return (
    <section className="bg-brand-background-1 text-brand-gray-light min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Replace <h1> with TitleSection */}
        <TitleSection
          subtitle="Your Guide"
          title="Gym Insights"
          className="mb-8"
        />

        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="mb-8 p-6 bg-brand-background-2 rounded-lg"
          >
            <h2 className="text-2xl font-semibold text-white mb-2">
              {post.title}
            </h2>
            <p className="text-brand-gray-medium">{post.excerpt}</p>
            <a
              href={`#${post.slug}`}
              className="inline-block mt-4 text-brand-orange hover:underline"
            >
              Read More &rarr;
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

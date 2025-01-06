import React from "react";
import { notFound } from "next/navigation";
import { blogPosts } from "@/components/Blog/data";
import { Breadcrumb } from "@/components/Breadcrumb";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

const BlogPostPage: React.FC<BlogPostPageProps> = async ({ params }) => {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound(); // Display a 404 page if the post is not found
  }

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        route="Blog Post"
      />

      {/* Blog Post Content */}
      <div className="bg-brand-background-2 text-brand-gray-light min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Title Section */}
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            {post?.title}
          </h1>
          <p className="text-sm text-brand-gray-medium mb-8">
            Published on {post?.date} • <span className="text-brand-orange">{post?.readTime} min read</span>
          </p>

          {/* Content Section */}
          <div
            className="text-lg font-mulish leading-relaxed text-brand-gray-light tracking-wide space-y-6"
            dangerouslySetInnerHTML={{ __html: post?.content ?? "" }}
          />
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;

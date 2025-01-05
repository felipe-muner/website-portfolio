import React from "react";
import { notFound } from "next/navigation";
import { blogPosts } from "@/components/Blog/data";


interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ params }) => {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound(); // Display a 404 page if the post is not found
  }

  return (
    <div className="bg-brand-background-1 text-brand-gray-light min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-6">{post?.title}</h1>
        <p className="text-sm text-brand-gray-medium mb-4">
          Published on {post?.date} • {post?.readTime} min read
        </p>
        <div
          className="text-brand-gray-light font-mulish leading-7"
          dangerouslySetInnerHTML={{ __html: post?.content ?? "" }}
        />
      </div>
    </div>
  );
};

export default BlogPostPage;

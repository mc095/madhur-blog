import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params; // Await the entire params object

  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    notFound();
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Ensure frontmatter data exists
    if (!data || !content) {
      console.error(`Invalid frontmatter or content in file: ${filePath}`);
      notFound();
    }

    return <BlogPostClient postData={{ data, content }} />;
  } catch (error) {
    console.error(`Error processing blog post ${slug}:`, error);
    notFound();
  }
}
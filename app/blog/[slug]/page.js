import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import Post from '@/lib/models/Post';
import connectToDatabase from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

async function getPostBySlug(slug) {
  try {
    await connectToDatabase();
    const post = await Post.findOne({ slug });
    
    if (post) {
      return {
        data: {
          title: post.title,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          date: post.createdAt,
        },
        content: post.content
      };
    }
  } catch (error) {
    console.error(`Error fetching post ${slug} from MongoDB:`, error);
  }
  
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return { data, content };
  } catch (error) {
    console.error(`Error reading post file ${slug}:`, error);
    return null;
  }
}

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

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const postData = await getPostBySlug(slug);
  
  if (!postData) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: postData.data.title,
    description: postData.data.excerpt || `Read more about ${postData.data.title}`,
  };
}

export default async function BlogPost({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const postData = await getPostBySlug(slug);
  
  if (!postData) {
    notFound();
  }
  
  return <BlogPostClient postData={postData} />;
}
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import BlogPostCard from '../../components/BlogPostCard';
import Post from '@/lib/models/Post';
import connectToDatabase from '@/lib/mongodb';

async function getAllPosts() {
  const posts = [];
  
  // Get posts from MongoDB
  try {
    await connectToDatabase();
    const dbPosts = await Post.find({}).sort({ createdAt: -1 });
    
    posts.push(...dbPosts.map(post => ({
      slug: post.slug,
      title: post.title || 'Untitled',
      excerpt: post.excerpt || '',
      coverImage: post.coverImage || null,
      date: post.createdAt,
    })));
  } catch (error) {
    console.error('Error fetching posts from MongoDB:', error);
  }
  
  // Get posts from filesystem as fallback
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const fileNames = fs.readdirSync(postsDirectory);
    
    for (const fileName of fileNames) {
      if (!fileName.endsWith('.md')) continue;
      
      const slug = fileName.replace(/\.md$/, '');
      
      // Skip if already in posts from DB
      if (posts.some(post => post.slug === slug)) continue;
      
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      posts.push({
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || '',
        coverImage: data.coverImage || null,
        date: data.date ? new Date(data.date) : new Date(),
      });
    }
  } catch (error) {
    console.error('Error reading posts from filesystem:', error);
  }
  
  // Sort posts by date
  return posts.sort((a, b) => (new Date(b.date) - new Date(a.date)));
}

export const metadata = {
  title: 'Blog',
  description: 'Read our latest blog posts',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-10 tracking-wide text-left text-[var(--text-primary)]">
        Blog Posts
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <BlogPostCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              slug={post.slug}
              coverImage={post.coverImage}
            />
          ))
        ) : (
          <p className="text-[var(--text-secondary)]">No blog posts found.</p>
        )}
      </div>
    </div>
  );
}
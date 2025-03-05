import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import BlogPostCard from '../../components/BlogPostCard';

export default function BlogPage() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug: fileName.replace(/\.md$/, ''),
      title: data.title,
      excerpt: data.excerpt,
      coverImage: data.coverImage || null,
    };
  });

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(b.date));

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-10 tracking-wide text-left text-[var(--text-primary)]">
        Blog Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <BlogPostCard
            key={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            slug={post.slug}
            coverImage={post.coverImage}
          />
        ))}
      </div>
    </div>
  );
}
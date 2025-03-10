import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import BlogPostCard from '../components/BlogPostCard';
import Link from 'next/link';

export default function HomePage() {
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

  posts.sort((a, b) => new Date(b.date) - new Date(b.date));

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl mb-10 tracking-wide text-left text-[var(--text-primary)]">
        Featured Posts
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
      <div className="mt-12 text-center">
        <Link href="/blog" className="text-[var(--link)] hover:text-[var(--link-hover)]">
          View All Posts
        </Link>
      </div>

      <div className="mt-24 mb-16">
        <h2 className="text-2xl mb-10 text-[var(--text-primary)]">Connect</h2>
        <p className="text-base text-[var(--text-muted)] mb-4">
          Feel free to contact me at{' '}
          <a href="mailto:ganeshvathumilli@gmail.com" className="text-[var(--link)] hover:text-[var(--link-hover)]">
            ganeshvathumilli@gmail.com
          </a>
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/mc095"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[var(--button-bg)] text-[var(--button-text)] text-sm rounded-full hover:bg-[var(--button-hover-bg)] transition-colors"
          >
            GitHub →
          </a>
          <a
            href="https://www.linkedin.com/in/ganesh097/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[var(--button-bg)] text-[var(--button-text)] text-sm rounded-full hover:bg-[var(--button-hover-bg)] transition-colors"
          >
            LinkedIn →
          </a>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPostCard({ title, excerpt, slug, coverImage }) {
  return (
    <Link href={`/blog/${slug}`}>
      <div className="bg-[var(--card-bg)] rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 h-full flex flex-col">
        {coverImage && (
          <div className="relative w-full h-40">
            <Image 
              src={coverImage} 
              alt={title} 
              fill 
              style={{ objectFit: 'cover' }} 
              className="rounded-t-lg" 
            />
          </div>
        )}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{title}</h3>
          <p className="text-[var(--text-muted)] text-sm line-clamp-3 flex-grow">
            {excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { evaluate } from '@mdx-js/mdx';
import { MDXProvider } from '@mdx-js/react';
import * as runtime from 'react/jsx-runtime';
import { useTheme } from '../../context/ThemeContext';

// Utility function to slugify text for heading IDs
function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

// Custom Heading component with anchor link and level-based styling
function createHeading(level) {
  const CustomHeading = ({ children, ...props }) => {
    const slug = slugify(children);
    const Tag = `h${level}`; // Dynamically create the heading tag (h1, h2, etc.)

    // Define font sizes based on heading level
    const fontSizeClass = {
      1: 'text-3xl md:text-4xl',
      2: 'text-2xl md:text-3xl',
      3: 'text-xl md:text-2xl',
      4: 'text-lg md:text-xl',
      5: 'text-base md:text-lg',
      6: 'text-base md:text-lg',
    }[level] || 'text-base md:text-lg';

    return (
      <div className="relative group">
        <a
          href={`#${slug}`}
          className="absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-lg"
          aria-label={`Link to ${children}`}
        >
          #
        </a>
        <Tag className={`mt-8 mb-4 font-bold text-[var(--text-primary)] ${fontSizeClass}`} id={slug} {...props}>
          {children}
        </Tag>
      </div>
    );
  };
  CustomHeading.displayName = `Heading${level}`;
  return CustomHeading;
}

// Custom Paragraph component
function createParagraph({ children, ...props }) {
  return (
    <p
      className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mt-2 mb-6"
      {...props}
    >
      {children}
    </p>
  );
}

// Custom Link component
function CustomLink({ href, children, ...props }) {
  if (href.startsWith('/')) {
    return (
      <a href={href} className="text-[var(--link)] hover:text-[var(--link-hover)] underline transition-colors" {...props}>
        {children}
      </a>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} className="text-[var(--link)] hover:text-[var(--link-hover)] underline transition-colors" {...props}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--link)] hover:text-[var(--link-hover)] underline transition-colors"
      {...props}
    >
      {children}
    </a>
  );
}

// Custom Image component
function createImage({ alt, src, ...props }) {
  if (!src) {
    console.error("Image requires a valid 'src' property.");
    return null;
  }

  return (
    <div className="my-12">
      <Image
        src={src}
        alt={alt || 'Blog post image'}
        width={800}
        height={450}
        style={{ objectFit: 'cover' }}
        className="rounded-lg"
        {...props}
      />
    </div>
  );
}

// Custom List components
function createUnorderedList({ children, ...props }) {
  return (
    <ul className="list-disc pl-6 mb-8" {...props}>
      {children}
    </ul>
  );
}

function createListItem({ children, ...props }) {
  return (
    <li className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-2" {...props}>
      {children}
    </li>
  );
}

// Custom components for MDX rendering
const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: createParagraph,
  a: CustomLink,
  img: createImage,
  ul: createUnorderedList,
  li: createListItem,
};

export default function BlogPostClient({ postData }) {
  const { data, content } = postData;
  const [MDXContent, setMDXContent] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const articleRef = useRef(null);

  useEffect(() => {
    const loadMDX = async () => {
      try {
        const { default: Component } = await evaluate(content, {
          ...runtime,
          useMDXComponents: () => components,
        });
        setMDXContent(() => Component);
      } catch (error) {
        console.error('Error evaluating MDX:', error);
      }
    };

    loadMDX();
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;

      const scrollTop = window.scrollY;
      const docHeight = articleRef.current.offsetHeight;
      const winHeight = window.innerHeight;

      const scrollPercent = scrollTop / (docHeight - winHeight);
      const progress = Math.min(Math.max(scrollPercent, 0), 1);

      setScrollProgress(progress * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!MDXContent) {
    return (
      <div className="max-w-3xl mx-auto">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 z-50 h-1 bg-[var(--link)] transition-all duration-100 ease-out"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
        }}
      />
      <div ref={articleRef} className="max-w-3xl mx-auto">
        {data.coverImage && (
          <div className="relative w-full h-96 mb-16">
            <Image
              src={data.coverImage}
              alt={data.title || 'Blog post cover'}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        )}
        <article className="prose max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{data.title || 'Untitled'}</h1>
          <p className="text-lg md:text-xl text-[var(--text-muted)] mb-16 leading-loose">
            {data.excerpt || 'No description available.'}
          </p>
          <MDXProvider components={components}>
            <MDXContent />
          </MDXProvider>
        </article>
      </div>
    </>
  );
}
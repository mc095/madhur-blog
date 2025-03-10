
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SecretBlogEditor() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('edit');
  
  useEffect(() => {
    if (editSlug) {
      fetchPost(editSlug);
    }
  }, [editSlug]);

  const fetchPost = async (slug) => {
    try {
      const response = await fetch(`/api/posts/${slug}`);
      if (response.ok) {
        const post = await response.json();
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setCoverImage(post.coverImage || '');
      }
    } catch (error) {
      console.error('Error fetching post', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const postData = {
      title,
      slug,
      content,
      excerpt,
      coverImage,
    };
    
    try {
      const url = editSlug 
        ? `/api/posts/${editSlug}` 
        : '/api/posts';
      
      const method = editSlug ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (response.ok) {
        setMessage(editSlug ? 'Post updated successfully!' : 'Post created successfully!');
        if (!editSlug) {
          resetForm();
        }
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setCoverImage('');
  };
  
  const generateSlug = () => {
    setSlug(title.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {editSlug ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100' : 'bg-green-100'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={generateSlug}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-sm text-gray-500">This will be the URL: /blog/{slug}</p>
        </div>
        
        <div>
          <label className="block mb-1">Excerpt (optional)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-2 border rounded"
            rows="2"
          />
        </div>
        
        <div>
          <label className="block mb-1">Cover Image URL (optional)</label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-1">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded font-mono"
            rows="15"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isSubmitting ? 'Submitting...' : editSlug ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
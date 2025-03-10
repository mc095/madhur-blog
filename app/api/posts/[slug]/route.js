
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';

export async function GET(request, { params }) {
  const { slug } = params;
  
  try {
    await connectToDatabase();
    const post = await Post.findOne({ slug });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { slug } = params;
  const body = await request.json();
  
  try {
    await connectToDatabase();
    const updatedPost = await Post.findOneAndUpdate(
      { slug },
      { ...body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { slug } = params;
  
  try {
    await connectToDatabase();
    const deletedPost = await Post.findOneAndDelete({ slug });
    
    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
  }
}
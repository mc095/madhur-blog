const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const matter = require('gray-matter');

const MONGODB_URI = "mongodb+srv://ganeshvathumilli:cSfTToPxkMhzXvml@cluster0.hfhyx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const PostSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: String,
  coverImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

async function importPosts() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const Post = mongoose.model('Post', PostSchema);
  const postsDirectory = path.join(process.cwd(), 'posts');
  
  const fileNames = fs.readdirSync(postsDirectory);
  
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;
    
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    const { data, content } = matter(fileContents);
    
    const slug = fileName.replace(/\.md$/, '');
    
    try {
      const existingPost = await Post.findOne({ slug });
      
      if (existingPost) {
        console.log(`Updating post: ${slug}`);
        await Post.findOneAndUpdate(
          { slug },
          {
            title: data.title || slug,
            content,
            excerpt: data.excerpt || '',
            coverImage: data.coverImage || '',
            updatedAt: Date.now(),
          }
        );
      } else {
        console.log(`Creating post: ${slug}`);
        await Post.create({
          slug,
          title: data.title || slug,
          content,
          excerpt: data.excerpt || '',
          coverImage: data.coverImage || '',
        });
      }
    } catch (error) {
      console.error(`Error processing ${fileName}:`, error);
    }
  }
  
  console.log('Import completed');
  mongoose.disconnect();
}

importPosts().catch(console.error);
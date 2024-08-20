import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Paper, Button } from '@mui/material';
import { backend } from 'declarations/backend';

interface Post {
  id: bigint;
  title: string;
  content: string;
  timestamp: bigint;
}

const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const result = await backend.getPost(BigInt(id));
          if (result.length > 0) {
            setPost(result[0]);
          }
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
      </Typography>
      <Typography variant="body1" paragraph>
        {post.content}
      </Typography>
      <Button component={Link} to="/" variant="outlined">
        Back to Posts
      </Button>
    </Paper>
  );
};

export default PostView;

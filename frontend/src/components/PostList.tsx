import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { backend } from 'declarations/backend';

interface Post {
  id: bigint;
  title: string;
  content: string;
  timestamp: bigint;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await backend.getPosts();
        setPosts(result);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <Button component={Link} to="/create" variant="contained" color="primary" sx={{ mb: 2 }}>
        Create New Post
      </Button>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={Number(post.id)}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                </Typography>
                <Button component={Link} to={`/post/${post.id}`} variant="outlined" sx={{ mt: 1 }}>
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default PostList;

import styled from '@emotion/styled';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Container from '../common/Container';
import { WindowWidthContext } from '../context/WindowWidthContext';
import Post from './Post';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0);
  const { isSmallerDevice } = useContext(WindowWidthContext);
  const [hasNext, setHasNext] = useState(true);

  const fetchPost = async () => {
    const limit = isSmallerDevice ? 5 : 10;
    const { data: posts } = await axios.get('/api/v1/posts', {
      params: { start, limit },
    });

    if (posts.length > 0) {
      setPosts(prevPosts => [...prevPosts, ...posts]);
      if (posts.length < limit) setHasNext(false);
    } else setHasNext(false);

    setStart(prev => prev + limit);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleClick = () => {
    setIsLoading(true);

    fetchPost();

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {hasNext && (
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        )}
      </div>
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface GitHubButtonProps {
  repoOwner?: string;
  repoName?: string;
  initialStarCount?: number;
}

const GitHubButton: React.FC<GitHubButtonProps> = ({ 
  repoOwner = "eurusik",
  repoName = "lucky-wheel",
  initialStarCount = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [starCount, setStarCount] = useState<number>(initialStarCount);
  const [formattedStars, setFormattedStars] = useState<string>('0');
  const repoUrl = `https://github.com/${repoOwner}/${repoName}`;

  useEffect(() => {
    // Fetch the actual star count from GitHub API
    const fetchStarCount = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`);
        const data = await response.json();
        if (data.stargazers_count) {
          setStarCount(data.stargazers_count);
        }
      } catch (error) {
        console.error('Error fetching GitHub stars:', error);
      }
    };

    fetchStarCount();
  }, [repoOwner, repoName]);

  useEffect(() => {
    // Format star count (e.g., 6800 -> 6.8k)
    if (starCount >= 1000) {
      setFormattedStars(`${(starCount / 1000).toFixed(1)}k`);
    } else {
      setFormattedStars(starCount.toString());
    }
  }, [starCount]);

  return (
    <Box
      component="a"
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        backgroundColor: '#f6f8fa',
        border: '1px solid #d0d7de',
        borderRadius: 30,
        padding: 0,
        height: 32,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#f3f4f6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      }}
      aria-label={`Star on GitHub (${formattedStars} stars)`}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: { xs: '6px 10px', sm: '6px 12px' },
        borderRight: '1px solid #d0d7de',
      }}>
        <StarIcon sx={{ 
          fontSize: { xs: 18, sm: 20 }, 
          color: '#57606a',
          marginRight: { xs: 0.5, sm: 1 }
        }} />
        <Box component="span" sx={{ 
          fontSize: { xs: 14, sm: 16 }, 
          fontWeight: 500, 
          color: '#24292f',
          display: { xs: isMobile ? 'none' : 'inline', sm: 'inline' }
        }}>
          Star
        </Box>
      </Box>
      <Box sx={{ 
        padding: { xs: '6px 10px', sm: '6px 12px' }, 
        fontSize: { xs: 14, sm: 16 }, 
        fontWeight: 600, 
        color: '#24292f'
      }}>
        {formattedStars}
      </Box>
    </Box>
  );
};

export default GitHubButton;

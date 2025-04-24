import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  initialItemsCount?: number;
  loadMoreStep?: number;
  threshold?: number;
}

export function useInfiniteScroll<T>(
  allItems: T[],
  options: UseInfiniteScrollOptions = {}
) {
  const {
    initialItemsCount = 5,
    loadMoreStep = 5,
    threshold = 200
  } = options;

  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Initialize with initial items
  useEffect(() => {
    if (allItems.length > 0) {
      setVisibleItems(allItems.slice(0, initialItemsCount));
      setHasMore(allItems.length > initialItemsCount);
      setPage(1);
    } else {
      setVisibleItems([]);
      setHasMore(false);
      setPage(0);
    }
  }, [allItems, initialItemsCount]);

  // Load more items
  const loadMore = useCallback(() => {
    if (!hasMore) return;
    
    const nextItems = allItems.slice(0, initialItemsCount + (page * loadMoreStep));
    
    setVisibleItems(nextItems);
    setPage(prevPage => prevPage + 1);
    setHasMore(nextItems.length < allItems.length);
  }, [allItems, hasMore, initialItemsCount, loadMoreStep, page]);

  // Scroll event handler
  const handleScroll = useCallback(() => {
    if (!hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loadMore();
    }
  }, [hasMore, loadMore, threshold]);

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    visibleItems,
    hasMore,
    loadMore
  };
}

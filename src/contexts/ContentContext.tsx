import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';

/** =======================
 * Types
 * ======================= */
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date; 
  imageUrl?: string;
  tags: string[];
  featured?: boolean;
}

interface ContentContextType {
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedAt'>) => Promise<void>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  setFeaturedPost: (id: string) => Promise<void>;
  getFeaturedPost: () => BlogPost | undefined;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within a ContentProvider');
  return ctx;
}

export const __ssgInitialBlogPosts: { id: string; title: string }[] = [];

/** =======================
 * 工具函数
 * ======================= */
const sanitizeTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === 'string') return tags.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
};

const mapToBlogPost = (row: any): BlogPost => ({
  id: row.id.toString(),
  title: row.title ?? '',
  content: row.content ?? '',
  excerpt: row.excerpt ?? '',
  author: row.author ?? '',
  imageUrl: row.imageUrl ?? '',
  tags: sanitizeTags(row.tags),
  featured: !!row.featured,
  publishedAt: row.publishedAt ? new Date(row.publishedAt) : new Date(row.created_at || Date.now()),
});

/** =======================
 * Provider
 * ======================= */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // 1. 订阅 BlogPosts (LeadzapTable)
  useEffect(() => {
    let isMounted = true; // 🚨 防御：防止组件卸载后依然执行状态更新

    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('LeadzapTable')
          .select('*')
          .order('publishedAt', { ascending: false });

        if (error) {
          console.error('Error fetching LeadzapTable:', error);
        } else if (data && isMounted) {
          setBlogPosts(data.map(mapToBlogPost));
        }
      } catch (err) {
        console.error('Fetch exception:', err);
      }
    };

    fetchPosts();

    // 🚨 修复 1：生成动态频道名，防止 React Strict Mode 下 Supabase 内部冲突引发死循环
    const channelName = `leadzap_updates_${Date.now()}`;
    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'LeadzapTable' }, () => {
        if (isMounted) fetchPosts(); 
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, []); // 依赖项为 []，确保绝对只在挂载时运行一次

  /** ===========
   * CRUD: Blog (操作 LeadzapTable)
   * ============ */
  // 🚨 修复 2：使用 useCallback 缓存所有函数，杜绝因为函数重绘导致子组件无限刷新
  const addBlogPost = useCallback(async (input: Omit<BlogPost, 'id' | 'publishedAt'>) => {
    const { error } = await supabase.from('LeadzapTable').insert([{
      title: input.title,
      content: input.content,
      excerpt: input.excerpt || String(input.content).slice(0, 150) + '...',
      author: input.author,
      imageUrl: input.imageUrl || '',
      tags: sanitizeTags(input.tags),
      featured: !!input.featured,
      publishedAt: new Date().toISOString(), 
    }]);
    if (error) throw error;
  }, []);

  const updateBlogPost = useCallback(async (id: string, updates: Partial<BlogPost>) => {
    const payload: Record<string, any> = { ...updates };
    if (updates.tags) payload.tags = sanitizeTags(updates.tags);
    
    const { error } = await supabase
      .from('LeadzapTable')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
  }, []);

  const deleteBlogPost = useCallback(async (id: string) => {
    const { error } = await supabase.from('LeadzapTable').delete().eq('id', id);
    if (error) throw error;
  }, []);

  const setFeaturedPost = useCallback(async (id: string) => {
    await supabase.from('LeadzapTable').update({ featured: false }).neq('id', id);
    const { error } = await supabase.from('LeadzapTable').update({ featured: true }).eq('id', id);
    if (error) throw error;
  }, []);

  // 🚨 修复 3：正确使用 useCallback 返回函数本身，而不是像之前那样使用闭包
  const getFeaturedPost = useCallback(() => {
    return blogPosts.find((p) => p.featured) as BlogPost | undefined;
  }, [blogPosts]);

  // 🚨 修复 4 (最重要)：使用 useMemo 彻底锁定 Context Value，直接掐断全站无限重渲染的源头！
  const value = useMemo(() => ({
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    setFeaturedPost,
    getFeaturedPost,
  }), [blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, setFeaturedPost, getFeaturedPost]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
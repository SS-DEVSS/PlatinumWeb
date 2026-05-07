import axiosClient from "./axiosInstance";
import { BlogPost } from "../models/blog";

const client = axiosClient();

type BlogPostsResponse = {
  blogPosts: BlogPost[];
  total: number;
  totalPages: number;
};

export const fetchBlogs = async (
  page: number = 1,
  pageSize: number = 100,
  sortOrder: "asc" | "desc" = "desc",
  signal?: AbortSignal
): Promise<BlogPostsResponse> => {
  const { data } = await client.get("/blog/posts", { params: { page, pageSize, sortOrder }, signal });
  return {
    blogPosts: data.blogPosts || [],
    total: data.total || 0,
    totalPages: data.totalPages || 1,
  };
};

export const fetchBlogById = async (id: string, signal?: AbortSignal): Promise<BlogPost> => {
  const { data } = await client.get(`/blog/posts/${id}`, { signal });
  return data;
};

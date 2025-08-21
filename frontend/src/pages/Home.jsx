import React, { useEffect } from "react";
import Hero from "@/components/Hero";
import RecentBlog from "@/components/RecentBlog";
import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { setBlogs } from '@/redux/blogSlice'
import { toast } from "sonner";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await api.get("/api/blogs");
        dispatch(setBlogs(res?.data));
      } catch (err) {
        toast.error(err?.message || "Error fetching blogs!");
      }
    };

    getBlogs();
  }, []);

  return (
    <div className="pt-20">
      <Hero />
      <RecentBlog />
    </div>
  );
};

export default Home;

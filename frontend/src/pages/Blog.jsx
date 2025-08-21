import React, { useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/api";
import { setBlogs } from "@/redux/blogSlice";
import { toast } from "sonner";

const Blog = () => {
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

  const { blogs, searchBlogs } = useSelector((state) => state.blogs);

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto text-center flex flex-col space-y-4 items-center">
        <h1 className="text-4xl font-bold text-center pt-10 ">Our Blogs</h1>
        <hr className=" w-24 text-center border-2 border-red-500 rounded-full" />
      </div>
      <div className="max-w-6xl mx-auto  grid gap-10 grid-cols-1 md:grid-cols-3 py-10 px-4 md:px-0">
        {searchBlogs.length > 0 ? (
          searchBlogs.map((blog, index) => <BlogCard blog={blog} key={index} />)
        ) : blogs.length > 0 ? (
          blogs.map((blog, index) => <BlogCard blog={blog} key={index} />)
        ) : (
          <div className="col-span-full text-center mt-10 text-gray-500 text-4xl">
            No blogs found!
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

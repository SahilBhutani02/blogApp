import React from "react";
import { Badge } from "./ui/badge";
import BlogCardList from "./BlogCardList";
import { categories, suggestedBlogs } from "@/lib/constants";
import { useSelector } from "react-redux";

const RecentBlog = () => {
  const { blogs, searchBlogs } = useSelector((store) => store.blogs);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 pb-10">
      <div className="max-w-6xl mx-auto  flex flex-col space-y-4 items-center">
        <h1 className="text-4xl font-bold pt-10 ">Recent Blogs</h1>
        <hr className=" w-24 text-center border-2 border-red-500 rounded-full" />
      </div>
      <div
        className={`max-w-7xl mx-auto flex gap-6 ${
          blogs?.length === 0 ? "w-full" : ""
        }`}
      >
        <div
          className={`mt-10 px-4 md:px-0 ${
            blogs?.length === 0 ? "w-full" : "w-full md:w-[calc(100%-500px)]"
          }`}
        >
          {searchBlogs?.length > 0
            ? searchBlogs?.slice(0, 4)?.map((blog, index) => {
                return <BlogCardList key={index} blog={blog} />;
              })
            : blogs?.slice(0, 4)?.map((blog, index) => {
                return <BlogCardList key={index} blog={blog} />;
              })}
        </div>
        <div className="bg-white hidden md:block dark:bg-gray-700 w-[500px] p-5 rounded-md mt-10">
          <h1 className="text-2xl font-semibold">Popular categories</h1>
          <div className="my-5 flex flex-wrap gap-3">
            {categories?.map((item, index) => {
              return <Badge key={index}> {item?.category}</Badge>;
            })}
          </div>
          <div className="mt-7">
            <h2 className="text-xl font-semibold mb-3">Suggested Blogs</h2>
            <ul className="space-y-3">
              {suggestedBlogs.map((title, idx) => (
                <li
                  key={idx}
                  className="text-sm dark:text-gray-100  hover:underline cursor-pointer"
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBlog;

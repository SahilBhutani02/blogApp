import React from "react";
import {
  Breadcrumb,
  // BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import userLogo from "../assets/user.jpg";
import { useSelector } from "react-redux";

const BlogView = () => {
  const params = useParams();
  const blogId = parseInt(params.blogId);
  const { blogs } = useSelector((store) => store.blogs);
  const selectedBlog = blogs?.find((blog) => blog?.id === blogId);

  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  };

  return (
    <div className="pt-14">
      <div className="max-w-6xl mx-auto p-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to={"/"}>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <Link to={"/blogs"}>
                <BreadcrumbLink>Blogs</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedBlog?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Blog Header */}
        <div className="my-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {selectedBlog?.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={userLogo} alt="Author" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedBlog?.author?.username}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Published on {changeTimeFormat(selectedBlog?.created_at)} • 8 min read
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={selectedBlog?.thumbnail}
            alt="Next.js Development"
            width={1000}
            height={500}
            className="w-full object-cover"
          />
          <p className="text-sm text-muted-foreground mt-2 italic">
            {selectedBlog?.subtitle}
          </p>
        </div>

        <p
          className=""
          dangerouslySetInnerHTML={{ __html: selectedBlog?.description }}
        />

        <div className="mt-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {selectedBlog?.tags?.map((item, index) => {
              return (
                <Badge variant="secondary" key={index}>
                  #{item}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;

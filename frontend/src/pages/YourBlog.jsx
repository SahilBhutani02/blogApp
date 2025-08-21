import { Card } from "@/components/ui/card";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { setYourBlogs, deleteBlog } from "@/redux/blogSlice";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";

const YourBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { yourBlogs, searchBlogs } = useSelector((store) => store.blogs);

  useEffect(() => {
    const getYourBlogs = async () => {
      try {
        const res = await api.get("/api/your-blogs");
        dispatch(setYourBlogs(res?.data));
      } catch (err) {
        toast.error(err?.message || "Error fetching blogs!");
      }
    };

    getYourBlogs();
  }, []);

  const deleteBlogById = async (id) => {
    try {
      await api.delete(`/api/delete-blog/${id}`);
      dispatch(deleteBlog(id));
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Error to delete blog!");
    }
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
    // console.log("formattedDate", date);
  };

  return (
    <div className="pb-10 pt-20 h-screen">
      <div className="max-w-6xl mx-auto mt-8 ">
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption>A list of your recent blogs.</TableCaption>
            <TableHeader className="overflow-x-auto">
              <TableRow>
                {/* <TableHead className="w-[100px]">Author</TableHead> */}
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-x-auto ">
              {searchBlogs.length > 0
                ? searchBlogs?.map((item, index) => (
                    <TableRow key={index}>
                      {/* <TableCell className="font-medium">{item.author.firstName}</TableCell> */}
                      <TableCell className="flex gap-4 items-center">
                        <img
                          src={item?.thumbnail}
                          alt=""
                          className="w-20 rounded-md hidden md:block"
                        />
                        <h1
                          className="hover:underline cursor-pointer"
                          onClick={() => navigate(`/blogs/${item?.id}`)}
                        >
                          {item?.title}
                        </h1>
                      </TableCell>
                      <TableCell>{item?.category}</TableCell>
                      <TableCell className="">
                        {formatDate(item?.created_at)}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <BsThreeDotsVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[180px]">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/write-blog/${item?.id}`)
                              }
                            >
                              <Edit />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => deleteBlogById(item?.id)}
                            >
                              <Trash2 />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                : yourBlogs?.map((item, index) => (
                    <TableRow key={index}>
                      {/* <TableCell className="font-medium">{item.author.firstName}</TableCell> */}
                      <TableCell className="flex gap-4 items-center">
                        <img
                          src={item?.thumbnail}
                          alt=""
                          className="w-20 rounded-md hidden md:block"
                        />
                        <h1
                          className="hover:underline cursor-pointer"
                          onClick={() => navigate(`/blogs/${item?.id}`)}
                        >
                          {item?.title}
                        </h1>
                      </TableCell>
                      <TableCell>{item?.category}</TableCell>
                      <TableCell className="">
                        {formatDate(item?.created_at)}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <BsThreeDotsVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[180px]">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/write-blog/${item?.id}`)
                              }
                            >
                              <Edit />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => deleteBlogById(item?.id)}
                            >
                              <Trash2 />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default YourBlog;

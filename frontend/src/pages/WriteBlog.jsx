import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "@/lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { deleteBlog } from "@/redux/blogSlice";
import api from "@/lib/api";

const WriteBlog = () => {
  const editor = useRef(null);

  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = parseInt(params?.blogId);
  const { yourBlogs } = useSelector((store) => store.blogs);
  const selectBlog = yourBlogs?.find((blog) => blog?.id === id);
  const [tagInput, setTagInput] = useState("");
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    tags: [],
    thumbnail: null,
  });

  useEffect(() => {
    if (id && selectBlog) {
      setBlogData({
        title: selectBlog.title || "",
        subtitle: selectBlog.subtitle || "",
        description: selectBlog.description || "",
        category: selectBlog.category || "",
        tags: selectBlog.tags || [],
        thumbnail: selectBlog.thumbnail || null,
      });
      setPreviewThumbnail(selectBlog.thumbnail || null);
    } else {
      setBlogData({
        title: "",
        subtitle: "",
        description: "",
        category: "",
        tags: [],
        thumbnail: null,
      });
      setPreviewThumbnail(null);
    }
  }, [id, selectBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setBlogData((prev) => ({ ...prev, category: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader?.result);
      fileReader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !blogData.tags.includes(newTag)) {
      setBlogData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setBlogData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Generate tags using OpenAI API
  const handleGenerateTagsWithAI = async () => {
    setLoadingTags(true);
    try {
      if (!blogData.title?.trim()) {
        toast.error("Please enter the blog title!");
        return;
      }

      const { data } = await api.post("/api/generate-seo-tags", {
        title: blogData.title,
      });



      const generatedTags = data?.data || [];

      const uniqueNewTags = generatedTags.filter(
        (tag) => !blogData.tags.includes(tag)
      );

      // Update blogData
      setBlogData((prev) => ({
        ...prev,
        tags: [...prev.tags, ...uniqueNewTags],
      }));

      toast.success("Tags generated with AI.");
    } catch (error) {
      console.error("Error generating tags:", error);
    } finally {
      setLoadingTags(false);
    }
  };

  // This calls your OpenAI-powered Django endpoint
  const handleGenerateDescriptionWithAI = async () => {
    setLoadingDescription(true);
    try {
      if (!blogData.title?.trim()) {
        toast.error("Please enter the blog title!");
        return;
      }

      const { data } = await api.post("/api/generate-description", {
        title: blogData.title,
      });


      setBlogData((prev) => ({ ...prev, description: data?.data })); // Update JoditEditor value
      toast.success("Blog description generated with AI.");
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setLoadingDescription(false);
    }
  };

  const BlogHandler = async () => {
    const formData = new FormData();

    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", blogData.description);
    formData.append("category", blogData.category);
    blogData.tags.forEach((tag) => {
      formData.append("tags", tag); // 'tags[]' works better for arrays
    });

    if (blogData.thumbnail instanceof File) {
      formData.append("thumbnail", blogData.thumbnail);
    }

    setLoading(true);

    try {
      if (id) {
        await api.patch(`/api/write-blog/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Blog updated successfully");
      } else {
        await api.post("/api/write-blog", formData);
        toast.success("Blog created successfully");
      }
    } catch (error) {
      const msg = error?.response?.data?.title || error?.response?.data?.subtitle ||  "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
      setBlogData({
        title: "",
        subtitle: "",
        description: "",
        category: "",
        tags: [],
        thumbnail: null,
      });
      setPreviewThumbnail(null);
      navigate("/your-blog");

    }
  };

  const deleteBlogById = async () => {
    try {
      await api.delete(`/api/delete-blog/${id}`);
      dispatch(deleteBlog(id));
      toast.success("Blog deleted successfully");
      navigate("/your-blog");
    } catch (err) {
      toast.error(err?.message || "Error to delete blog!");
    }
  };

  return (
    <div className="pb-10 px-3 pt-20 ">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-2">
          <h1 className=" text-4xl font-bold ">Blog Information</h1>
          {id ? (
            <div className="w-full flex justify-end gap-3">
              <Button variant="destructive" onClick={deleteBlogById}>
                Remove
              </Button>
            </div>
          ) : (
            ""
          )}
          <div className="pt-10">
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Enter a title"
              name="title"
              value={blogData?.title}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>
          <div>
            <Label>subtitle</Label>
            <Input
              type="text"
              placeholder="Enter a subtitle"
              name="subtitle"
              value={blogData?.subtitle}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>

          <div>
            <Label>Thumbnail</Label>
            <Input
              id="file"
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit dark:border-gray-300"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Thumbnail"
              />
            )}
          </div>

          <div>
            <Label>Category</Label>
            <Select
              onValueChange={selectCategory}
              value={blogData?.category}
              className="dark:border-gray-300"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {categories?.map((item, index) => {
                    return (
                      <SelectItem value={item?.category} key={index}>
                        {item?.category}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tags</Label>

            {/* Display Tags */}
            <div className="flex flex-wrap gap-2 my-2">
              {blogData?.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-gray-200 text-sm rounded-full flex items-center gap-2"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {/* Input + Buttons */}
            <div className="flex gap-2 mt-2">
              <Input
                type="text"
                placeholder="Enter a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="dark:border-gray-300"
              />

              <Button type="button" onClick={handleAddTag}>
                Add Tag
              </Button>

              <Button
                type="button"
                onClick={handleGenerateTagsWithAI}
                disabled={loadingTags}
              >
                {loadingTags ? "Generating" : "Generate Tags with AI"}
              </Button>
            </div>
          </div>

          <div>
            <Label>Description</Label>

            <JoditEditor
              ref={editor}
              value={blogData?.description}
              onChange={(newContent) =>
                setBlogData((prev) => ({ ...prev, description: newContent }))
              }
              className="jodit_toolbar"
            />

            <Button
              type="button"
              className="mt-2"
              onClick={handleGenerateDescriptionWithAI}
              disabled={loadingDescription}
            >
              {loadingDescription ? "Generating..." : "Generate with AI"}
            </Button>
          </div>
          <div className="w-full flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button onClick={BlogHandler}>
              {loading ? "Please Wait" : id ? "Update" : "Create"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WriteBlog;

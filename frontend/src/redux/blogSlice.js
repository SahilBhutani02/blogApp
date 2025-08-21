import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: null,
    yourBlogs: null,
    searchBlogs: null,
  },
  reducers: {
    //actions
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setYourBlogs: (state, action) => {
      state.yourBlogs = action.payload;
    },
    setSearchBlogs: (state, action) => {
      state.searchBlogs = action.payload;
    },

    deleteBlog: (state, action) => {
      const blogId = action.payload;
      if (state.blogs) {
        state.blogs = state.blogs.filter((blog) => blog.id !== blogId);
      }
      if (state.yourBlogs) {
        state.yourBlogs = state.yourBlogs.filter((blog) => blog.id !== blogId);
      }
      if (state.searchBlogs) {
        state.searchBlogs = state.searchBlogs.filter((blog) => blog.id !== blogId);
      }
    },
  },
});

export const { setBlogs, setYourBlogs, setSearchBlogs, deleteBlog } = blogSlice.actions;
export default blogSlice.reducer;

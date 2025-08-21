import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import Logo from "../assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import userLogo from "../assets/user.jpg";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { ChartColumnBig, LogOut, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaMoon, FaRegEdit, FaSun } from "react-icons/fa";
import { toggleTheme } from "@/redux/themeSlice";
import { ACCESS_TOKEN } from "@/lib/constants";
import ResponsiveMenu from "./ResponsiveMenu";
import api from "@/lib/api";
import { setSearchBlogs } from "@/redux/blogSlice";

const Navbar = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const { theme } = useSelector((store) => store.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const location = useLocation(); 

  useEffect(() => {
    setSearchTerm("");
    dispatch(setSearchBlogs([]));
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      dispatch(setSearchBlogs([]));
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchSearchResults(searchTerm);
    }, 800);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, dispatch]);

  const fetchSearchResults = async (term) => {
    try {

      const result = await api.get(`/api/search-blog?q=${encodeURIComponent(term)}`);
      const searchedBlogs = result?.data || [];

      dispatch(setSearchBlogs(searchedBlogs));
      
      if (term.trim() && searchedBlogs.length === 0) {
      toast.error("No search blog found");
    }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while searching");
    }
  };


   const logoutHandler = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      await api.post("/api/user/logout/", { refresh });
      toast.success("Logged out");
    } catch (err) {
      toast.error(err?.message || "Error while Logout");
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };
  

  const toggleNav = () => {
    setOpenNav(!openNav);
  };
  return (
    <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* logo section */}
        <div className="flex gap-7 items-center">
          <Link to={"/"}>
            <div className="flex gap-2 items-center">
              <img
                src={Logo}
                alt=""
                className="w-7 h-7 md:w-10 md:h-10 dark:invert"
              />
              <h1 className="font-bold text-3xl md:text-4xl">Logo</h1>
            </div>
          </Link>
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search"
              className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px] hidden md:block"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* nav section */}
        <nav className="flex md:gap-7 gap-4 items-center">
          <ul className="hidden md:flex gap-7 items-center text-xl font-semibold">
            <NavLink to={"/"} className="cursor-pointer">
              <li>Home</li>
            </NavLink>
            <NavLink to={"/blogs"} className={`cursor-pointer`}>
              <li>Blogs</li>
            </NavLink>
            <NavLink to={"/about"} className={`cursor-pointer`}>
              <li>About</li>
            </NavLink>
            {/* <NavLink to={'/write-blog'} className={`cursor-pointer`}><li>Write a Blog</li></NavLink> */}
          </ul>
          <div className="flex">
            <Button onClick={() => dispatch(toggleTheme())} className="">
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>
            {token ? (
              <div className="ml-7 flex gap-3 items-center">
                {/* <Link to={'/profile'}> */}
                <DropdownMenu className="">
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={userLogo} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 dark:bg-gray-800">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/your-blog")}>
                        <ChartColumnBig />
                        <span>Your Blogs</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/write-blog")}>
                        <FaRegEdit />
                        <span>Create Blog</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler}>
                      <LogOut />
                      <span>Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* </Link> */}
                <Button className="hidden md:block" onClick={logoutHandler}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="ml-7 md:flex gap-2 ">
                <Link to={"/login"}>
                  <Button>Login</Button>
                </Link>
                <Link className="hidden md:block" to={"/signup"}>
                  <Button>Signup</Button>
                </Link>
              </div>
            )}
          </div>
          {openNav ? (
            <HiMenuAlt3 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          ) : (
            <HiMenuAlt1 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          )}
        </nav>
        <ResponsiveMenu
          openNav={openNav}
          setOpenNav={setOpenNav}
          logoutHandler={logoutHandler}
        />
      </div>
    </div>
  );
};

export default Navbar;

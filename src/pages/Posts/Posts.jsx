import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Spinner,
} from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PostCard from "../../components/PostCard/Postcard.jsx";
import UpdatePost from "../../components/UpdatePost/UpdatePost.jsx";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthUsercontext } from "../../components/Context/AuthContextProvider/AuthContextProvider";
import CreatePost from "../../components/CreatePost/CreatePost";

import { useState } from "react";
export default function Posts() {
  const { setUserToken } = useContext(AuthUsercontext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  

  function handleLogout() {
    localStorage.clear();
    setUserToken(null);
    navigate("/login");
  }
  
  const {
    data: postsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/posts?limit=50", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data?.data?.posts || [];
    },
  });

  // useMutation for creating posts
  const createPostMutation = useMutation({
    mutationFn: async (formDataOrBody) => {
      const token = localStorage.getItem("token");
      let response;
      if (formDataOrBody instanceof FormData) {
        response = await axios.post("/api/posts", formDataOrBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.post("/api/posts", formDataOrBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      // Share the post after creation
      const postData = response?.data?.data;
      const postId = postData?._id;
      if (postId) {
        await axios.post(
          "/api/sharepost",
          { postId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      return postData;
    },
    onSuccess: (newPost, _variables, _context) => {
      
      queryClient.setQueryData(["posts"], (oldPosts = []) => [newPost, ...oldPosts]);
      toast.success("Post created and shared successfully!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create post.");
    },
  });

  const posts = postsData || [];
  const [editingPost, setEditingPost] = useState(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" label="Loading Feed..." color="primary" labelColor="primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500">Failed to load posts.</div>;
  }

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">Route Posts</p>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
              profile
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link aria-current="page" color="secondary" to={"/posts"}>
              feed
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              notifications
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">profile</p>
              </DropdownItem>
              <DropdownItem key="settings">Settings</DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          <CreatePost
            onShared={(formDataOrBody, clearForm) => {
              createPostMutation.mutate(formDataOrBody, {
                onSuccess: (newPost) => {
                  clearForm();
                  // Refetch posts from backend to ensure correct data
                  queryClient.invalidateQueries({ queryKey: ["posts"] });
                },
              });
            }}
            isLoading={createPostMutation.isPending}
          />
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={(id) => {
                  queryClient.setQueryData(["posts"], (oldPosts = []) => oldPosts.filter((p) => p._id !== id));
                }}
                onEdit={(post) => setEditingPost(post)}
              />
            ))
          ) : (
            <p className="text-center text-default-500">No posts available yet.</p>
          )}
          {editingPost && (
            <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
                <UpdatePost
                  post={editingPost}
                  onUpdated={() => {
                    setEditingPost(null);
                    queryClient.invalidateQueries({ queryKey: ["posts"] });
                  }}
                />
                <button
                  className="mt-4 bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setEditingPost(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}


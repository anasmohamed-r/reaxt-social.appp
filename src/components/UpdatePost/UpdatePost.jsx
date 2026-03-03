import { useState, useContext } from "react";
import axios from "axios";
import { AuthUsercontext } from "../Context/AuthContextProvider/AuthContextProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UpdatePost({ post, onUpdated }) {
  const { token } = useContext(AuthUsercontext);
  const queryClient = useQueryClient();
  const [body, setBody] = useState(post?.body || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post?.image || null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updatePostMutation = useMutation({
    mutationFn: async (formDataOrBody) => {
      let response;
      if (formDataOrBody instanceof FormData) {
        response = await axios.put(`/api/posts/${post._id}`, formDataOrBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.put(`/api/posts/${post._id}`, formDataOrBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return response.data.data;
    },
    onSuccess: (updatedPost) => {
      setSuccess("Post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (onUpdated) onUpdated(updatedPost);
    },
    onError: (err) => {
      setError(err?.response?.data?.message || "Failed to update post.");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!body.trim()) {
      setError("Post body cannot be empty.");
      return;
    }
    let payload;
    if (image) {
      const formData = new FormData();
      formData.append("body", body);
      formData.append("image", image);
      payload = formData;
    } else {
      payload = { body };
    }
    updatePostMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white w-full rounded-2xl shadow p-6 max-w-xl mx-auto mb-8">
      <textarea
        className="w-full border-none bg-gray-100 rounded-xl p-4 mb-2 text-lg resize-none focus:outline-none"
        placeholder="Edit your post..."
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={4}
        required
      />
      {preview && (
        <div className="mb-2 w-full">
          <img src={preview} alt="preview" className="max-h-40 rounded" />
        </div>
      )}
      <label className="flex items-center gap-2 cursor-pointer text-green-600 font-medium">
        Change Photo/video
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </label>
      <button
        type="submit"
        className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow mt-4"
        disabled={updatePostMutation.isPending}
      >
        {updatePostMutation.isPending ? "Updating..." : "Update Post"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </form>
  );
}

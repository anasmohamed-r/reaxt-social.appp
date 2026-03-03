import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthUsercontext } from "../Context/AuthContextProvider/AuthContextProvider";

export default function CreateComment({ postId, onCommentCreated }) {
  const { token } = useContext(AuthUsercontext);
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const createCommentMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to create comment");
      return await response.json();
    },
    onSuccess: (data) => {
      setContent("");
      setError("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      if (onCommentCreated) onCommentCreated(data?.data);
    },
    onError: (err) => {
      setError(err.message || "Failed to create comment.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    const formData = new FormData();
    formData.append("content", content);
    createCommentMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      <textarea
        className="border rounded p-2"
        placeholder="Write a comment..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={2}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded"
        disabled={createCommentMutation.isPending || !content.trim()}
      >
        {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}

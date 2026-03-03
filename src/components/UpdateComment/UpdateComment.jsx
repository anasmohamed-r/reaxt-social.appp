import { useState, useContext } from "react";
import axios from "axios";
import { AuthUsercontext } from "../Context/AuthContextProvider/AuthContextProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UpdateComment({ comment, onUpdated }) {
  const { token } = useContext(AuthUsercontext);
  const queryClient = useQueryClient();
  const [content, setContent] = useState(comment?.content || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateCommentMutation = useMutation({
    mutationFn: async (body) => {
      console.log('Updating comment with ID:', comment._id, 'Payload:', body);
      const response = await axios.put(`/api/posts/comments/${comment._id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
    onSuccess: (updatedComment) => {
      setSuccess("Comment updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["comments", comment.postId] });
      if (onUpdated) onUpdated(updatedComment);
    },
    onError: (err) => {
      setError(err?.response?.data?.message || "Failed to update comment.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    updateCommentMutation.mutate({ content });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      <textarea
        className="border rounded p-2"
        placeholder="Edit your comment..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={2}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded"
        disabled={updateCommentMutation.isPending || !content.trim()}
      >
        {updateCommentMutation.isPending ? "Updating..." : "Update Comment"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
    </form>
  );
}

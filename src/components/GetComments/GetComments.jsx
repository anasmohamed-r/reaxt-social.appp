import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthUsercontext } from "../Context/AuthContextProvider/AuthContextProvider";
import CommentCard from "../CommentCard/CommentCard";

export default function GetComments({ postId }) {
  const { token } = useContext(AuthUsercontext);

  const {
    data: comments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      if (!postId) return [];
      const response = await fetch(`/api/posts/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      return data?.data?.comments || [];
    },
    enabled: !!postId,
  });

  if (isLoading) {
    return <p className="text-gray-400">Loading comments...</p>;
  }
  if (isError) {
    return <p className="text-red-400">Failed to load comments.</p>;
  }

  return (
    <div className="mt-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard key={comment._id} comments={comment} />
        ))
      ) : (
        <p className="text-gray-400">No comments yet.</p>
      )}
    </div>
  );
}

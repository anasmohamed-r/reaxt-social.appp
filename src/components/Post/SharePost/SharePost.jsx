import { useContext } from "react";
import axios from "axios";
import { AuthUsercontext } from "../../Context/AuthContextProvider/AuthContextProvider";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function SharePost({ postId, onShared }) {
  const { token } = useContext(AuthUsercontext);
  const queryClient = useQueryClient();

  const shareMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "/api/sharepost",
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Post shared successfully!");
      
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (onShared) onShared(postId);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to share post."
      );
    },
  });

  return (
    <Button
      color="primary"
      isLoading={shareMutation.isPending}
      onClick={() => shareMutation.mutate()}
      disabled={shareMutation.isPending || !postId}
      className="mt-2"
    >
      Share Post
    </Button>
  );
}



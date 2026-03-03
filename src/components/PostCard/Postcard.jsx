import { Card, CardHeader, CardBody, Avatar } from "@heroui/react";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useContext } from "react";
import axios from "axios";
import { AuthUsercontext } from "../Context/AuthContextProvider/AuthContextProvider";
import CommentCard from "../CommentCard/CommentCard";
import CreateComment from "../CreateComment/CreateComment";

export default function PostCard({ post, onEdit }) {
	const [comments, setComments] = useState([]);
	const [loadingComments, setLoadingComments] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const { token, userData } = useContext(AuthUsercontext);

	useEffect(() => {
		async function fetchComments() {
			if (!post?._id) return;
			setLoadingComments(true);
			try {
				const response = await axios.get(
					`/api/posts/${post._id}/comments`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setComments(response?.data?.data?.comments || []);
			} catch (err) {
				setComments([]);
			} finally {
				setLoadingComments(false);
			}
		}
        
		fetchComments();
	}, [post?._id, token]);
	if (!post) return null;
	const { body, image, creator, createdAt } = post;
	// Fallback: If creator is missing, fetch user profile dynamically for that userId
	const [dynamicUser, setDynamicUser] = useState(null);
	useEffect(() => {
		// Try to get userId from creator._id, fallback to post.userId
		const userId = creator?._id || post?.userId;
		if ((!creator || Object.keys(creator).length === 0) && userId && userData?.user?._id !== userId) {
			axios.get(`/users/profile?userId=${userId}`, {
				headers: { Authorization: `Bearer ${token}` }
			})
				.then(res => {
					setDynamicUser(res.data.data?.user || res.data.user || null);
				})
				.catch(() => setDynamicUser(null));
		} else if (userData?.user?._id === userId) {
			setDynamicUser(userData.user);
		}
	}, [creator, post?.userId, token, userData]);

	const displayUser = creator && Object.keys(creator).length > 0
			? creator
			: dynamicUser || {};
	function formatDate(date) {
		if (!date) return "";
		const d = new Date(date);
		return isNaN(d.getTime()) ? "" : d.toLocaleString();
	}
	const [liked, setLiked] = useState(false);

	const handleLike = () => setLiked((prev) => !prev);
	const [showCommentInput, setShowCommentInput] = useState(false);
	const handleCommentClick = () => setShowCommentInput((prev) => !prev);

    async function deletePost() {
        if (!post?._id) return;
        try {
            await axios.delete(`/api/posts/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                
            });
            if (typeof post.onDelete === 'function') {
                post.onDelete(post._id);
            }
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
        setShowDeleteConfirm(false);
    }

	return (
		<Card className="w-full rounded-xl shadow-md">
			<CardHeader className="flex items-center gap-3">
				<Avatar
					isBordered
					radius="full"
					size="md"
					src={displayUser?.profilePhoto || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
					name={displayUser?.username || "User"}
				/>
				   <div className="flex flex-col">
					   <span className="font-semibold">{displayUser?.name || "User"}</span>
					   <span className="text-xs text-gray-500">@{displayUser?.username || "username"}</span>
					   <span className="text-xs text-gray-400">{formatDate(createdAt) || ""}</span>
				   </div>
			</CardHeader>
			<CardBody>
				<p className="mb-2 text-base">{body}</p>
				{image && (
					<img src={image} alt="post" className="rounded-lg max-h-80 w-full object-cover mb-2" />
				)}
				<div className="flex gap-6 mt-2">
					<button
						className={`flex items-center gap-1 text-lg ${liked ? "text-red-500" : "text-gray-500"}`}
						onClick={handleLike}
						aria-label="Like post"
					>
						<FaRegHeart /> Like
					</button>
					<button
						className="flex items-center gap-1 text-lg text-gray-500"
						aria-label="Comment on post"
						onClick={handleCommentClick}
					>
						<FaRegComment /> Comment
					</button>
					<button
						className="flex items-center gap-1 text-lg text-blue-500 cursor-pointer"
						aria-label="Edit post"
						onClick={() => onEdit && onEdit(post)}
					>
						✏️ Edit
					</button>
					<button
						className="flex items-center gap-1 text-lg text-red-500 cursor-pointer"
						aria-label="Delete post"
						onClick={() => setShowDeleteConfirm(true)}
					>
						🗑️ Delete
					</button>
				</div>
			</CardBody>
			{/* Show comment input when button is clicked */}
			{showCommentInput && (
				<div className="mt-2">
					<CreateComment postId={post._id} onCommentCreated={() => {
						// Re-fetch comments after posting a new one
						async function fetchComments() {
							setLoadingComments(true);
							try {
								const response = await axios.get(
									`/api/posts/${post._id}/comments`,
									{
										headers: {
											Authorization: `Bearer ${token}`,
										},
									}
								);
								setComments(response?.data?.data?.comments || []);
							} catch (err) {
								setComments([]);
							} finally {
								setLoadingComments(false);
							}
						}
						fetchComments();
						setShowCommentInput(false);
					}} />
				</div>
			)}
			<div className="mt-4">
				{loadingComments ? (
					<p className="text-gray-400">Loading comments...</p>
				) : comments.length > 0 ? (
					comments.map((comment, idx) => (
						<CommentCard key={comment._id || idx} comments={comment} />
					))
				) : (
					<p className="text-gray-400">No comments yet.</p>
				)}
			</div>
			{showDeleteConfirm && (
				<div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
					<div className="bg-white p-6 rounded shadow-lg text-center">
						<p className="mb-4">Are you sure you want to delete this post?</p>
						<button
							className="bg-red-500 text-white px-4 py-2 rounded mr-2 cursor-pointer"
							onClick={deletePost}
						>
							Yes
						</button>
						<button
							className="bg-gray-300 px-4 py-2 rounded cursor-pointer"
							onClick={() => setShowDeleteConfirm(false)}
						>
							No
						</button>
					</div>
				</div>
			)}
		</Card>
	);
}

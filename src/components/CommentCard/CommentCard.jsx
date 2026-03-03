import { Avatar, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthUsercontext } from "../Context/AuthContextProvider/AuthContextProvider";
import UpdateComment from "../UpdateComment/UpdateComment";


export default function CommentCard({comments}) {
  // Handle case where comments is undefined or null
  if (!comments) {
    return null;
  }
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { token } = useContext(AuthUsercontext);

  // console.log(comments)
  async function deleteComment() {
    if (!comments?._id) return;
    const endpoint = `/api/posts/comments/${comments._id}`;
    console.log('Attempting to delete comment:', comments._id, 'Endpoint:', endpoint);
    try {
      await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (typeof comments.onDelete === 'function') {
        comments.onDelete(comments._id);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
    setShowDeleteConfirm(false);
  }
  
  const {commentcreator, content , createdAt} = comments 
  return (
    <Card className="max-w-85 gap-5 rounded-lg overflow-auto">          
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={commentcreator?.photo}
            name={commentcreator?.name}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{commentcreator?.username}</h4>
            <h5 className="text-small tracking-tight text-default-400">
              {commentcreator?.username}
            </h5>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowEdit(true)} className="text-blue-500 hover:text-blue-700 cursor-pointer">Edit</button>
          <button onClick={() => setShowDeleteConfirm(true)} className="text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{content}</p>
        <span className="pt-2">
          
          {/* <span aria-label="computer" className="py-2" role="img">
            
          </span> */}
        </span>
      </CardBody>
      {/* <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">4</p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div>
      </CardFooter> */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4">Are you sure you want to delete this comment?</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2 cursor-pointer"
              onClick={deleteComment}
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
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
            <UpdateComment
              comment={comments}
              onUpdated={() => setShowEdit(false)}
            />
            <button
              className="mt-4 bg-gray-300 px-4 py-2 rounded"
              onClick={() => setShowEdit(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

import { useContext, useState } from "react";
import { AuthUsercontext } from "../Context/AuthContextProvider/AuthContextProvider";
import { FaRegSmile, FaPhotoVideo, FaPaperPlane } from "react-icons/fa";

export default function CreatePost({ onShared, isLoading }) {
  const { userData } = useContext(AuthUsercontext);
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [privacy, setPrivacy] = useState("Public");

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // Clear form fields after mutation success
  const clearForm = () => {
    setSuccess("Post submitted!");
    setBody("");
    setImage(null);
    setPreview(null);
  };

  // Handle post submission
  const handleSubmit = async (e) => {
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
    if (onShared) {
      onShared(payload, clearForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white w-full rounded-2xl shadow p-6 max-w-xl mx-auto mb-8">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={userData?.user?.profilePhoto || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
          alt="avatar"
          className="w-12 h-12 rounded-full border"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-base">{userData?.user?.name || "User"}</span>
          <span className="text-xs text-gray-500">@{userData?.user?.username || "username"}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <select
            value={privacy}
            onChange={e => setPrivacy(e.target.value)}
            className="bg-gray-100 text-xs px-2 py-1 rounded border"
          >
            <option value="Public">Public</option>
            <option value="Friends">Friends</option>
            <option value="Only Me">Only Me</option>
          </select>
        </div>
      </div>
      <textarea
        className="w-full border-none bg-gray-100 rounded-xl p-4 mb-2 text-lg resize-none focus:outline-none"
        placeholder={`What's on your mind, ${userData?.username || "user"}?`}
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
      <hr className="my-3" />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-green-600 font-medium">
          <FaPhotoVideo size={20} /> Photo/video
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
        <button
          type="button"
          className="flex items-center gap-2 text-yellow-600 font-medium bg-transparent border-none cursor-pointer"
          tabIndex={-1}
          style={{ outline: "none" }}
        >
          <FaRegSmile size={20} /> Feeling/activity
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow"
          disabled={isLoading}
        >
          {isLoading ? "Posting..." : "Post"}
          <FaPaperPlane size={18} />
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </form>
  );
}

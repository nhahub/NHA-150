import { useState, useMemo, useEffect, useContext } from "react";
import "./editPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UploadWidget from "../../components/uploadWidget/uploadWidget";
import apiRequest from "../../lib/apiRequest";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";
import { LanguageContext } from '../../../context/languageContext';

function EditPostPage() {
  const post = useLoaderData();
  const { id } = useParams();
  const [value, setValue] = useState(post.postDetail?.desc || "");
  const [error, setError] = useState("");
  const [imgs, setImgs] = useState(post.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (post.postDetail?.desc) {
      setValue(post.postDetail.desc);
    }
    if (post.images) {
      setImgs(post.images);
    }
  }, [post]);

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  }), []);

  const formats = useMemo(() => [
    "header", "bold", "italic", "underline",
    "list", "bullet", "link", "image"
  ], []);

  const memoUwConfig = useMemo(() => ({
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dog8lzbc4",
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "estate",
    maxImageFileSize: 2000000,
    multiple: true,
    folder: "posts",
    sources: ["local", "url", "camera"],
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/posts/${id}`, {
        postData: {
          title: inputs.title || post.title,
          price: parseInt(inputs.price) || post.price,
          address: inputs.address || post.address,
          bedroom: parseInt(inputs.bedroom) || post.bedroom,
          bathroom: parseInt(inputs.bathroom) || post.bathroom,
          latitude: inputs.latitude || post.latitude,
          longitude: inputs.longitude || post.longitude,
          city: inputs.city || post.city,
          type: inputs.type || post.type,
          property: inputs.property || post.property,
          // Always send the current imgs array (allow empty -> deletes all images)
          images: imgs,
        },
        postDetail: {
          desc: value || post.postDetail?.desc,
          utilities: inputs.utilities || post.postDetail?.utilities,
          pet: inputs.pet || post.postDetail?.pet,
          income: inputs.income || post.postDetail?.income,
          size: parseInt(inputs.size) || post.postDetail?.size,
          school: parseInt(inputs.school) || post.postDetail?.school,
          bus: parseInt(inputs.bus) || post.postDetail?.bus,
          restaurant: parseInt(inputs.restaurant) || post.postDetail?.restaurant,
        }
      });
      navigate("/" + id);
      console.log("Post updated:", res.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || err.message || "Failed to update post");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>{t("updatePost")}</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">{t("title")}</label>
              <input id="title" name="title" type="text" defaultValue={post.title} />
            </div>
            <div className="item">
              <label htmlFor="price">{t("price")}</label>
              <input id="price" name="price" type="number" defaultValue={post.price} />
            </div>
            <div className="item">
              <label htmlFor="address">{t("address")}</label>
              <input id="address" name="address" type="text" defaultValue={post.address} />
            </div>
            <div className="item description">
              <label htmlFor="desc">{t("description")}</label>
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                modules={modules}
                formats={formats}
                key="editor"
              />
            </div>
            <div className="item">
              <label htmlFor="city">{t("city")}</label>
              <input id="city" name="city" type="text" defaultValue={post.city} />
            </div>
            <div className="item">
              <label htmlFor="bedroom">{t("bedroomNumber")}</label>
              <input min={1} id="bedroom" name="bedroom" type="number" defaultValue={post.bedroom} />
            </div>
            <div className="item">
              <label htmlFor="bathroom">{t("bathroomNumber")}</label>
              <input min={1} id="bathroom" name="bathroom" type="number" defaultValue={post.bathroom} />
            </div>
            <div className="item">
              <label htmlFor="latitude">{t("latitude")}</label>
              <input id="latitude" name="latitude" type="text" defaultValue={post.latitude} />
            </div>
            <div className="item">
              <label htmlFor="longitude">{t("longitude")}</label>
              <input id="longitude" name="longitude" type="text" defaultValue={post.longitude} />
            </div>
            <div className="item">
              <label htmlFor="type">{t("type")}</label>
              <select name="type" defaultValue={post.type}>
                <option value="rent">{t("rent")}</option>
                <option value="buy">{t("buy")}</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">{t("property")}</label>
              <select name="property" defaultValue={post.property}>
                <option value="apartment">{t("apartment")}</option>
                <option value="house">{t("house")}</option>
                <option value="condo">{t("condo")}</option>
                <option value="land">{t("land")}</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">{t("utilitiesPolicy")}</label>
              <select name="utilities" defaultValue={post.postDetail?.utilities}>
                <option value="owner">{t("ownerResponsible")}</option>
                <option value="tenant">{t("tenantResponsible")}</option>
                <option value="shared">{t("shared")}</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">{t("petPolicyLabel")}</label>
              <select name="pet" defaultValue={post.postDetail?.pet}>
                <option value="allowed">{t("allowed")}</option>
                <option value="not-allowed">{t("notAllowed")}</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">{t("incomePolicyLabel")}</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder={t("incomePolicyLabel")}
                defaultValue={post.postDetail?.income}
              />
            </div>
            <div className="item">
              <label htmlFor="size">{t("totalSize")} ({t("sqft")})</label>
              <input min={0} id="size" name="size" type="number" defaultValue={post.postDetail?.size} />
            </div>
            <div className="item">
              <label htmlFor="school">{t("schoolLabel")}</label>
              <input min={0} id="school" name="school" type="number" defaultValue={post.postDetail?.school} />
            </div>
            <div className="item">
              <label htmlFor="bus">{t("bus")}</label>
              <input min={0} id="bus" name="bus" type="number" defaultValue={post.postDetail?.bus} />
            </div>
            <div className="item">
              <label htmlFor="restaurant">{t("restaurant")}</label>
              <input min={0} id="restaurant" name="restaurant" type="number" defaultValue={post.postDetail?.restaurant} />
            </div>
            <button className="sendButton" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  {t("loading")}...
                </>
              ) : (
                t("updatePost")
              )}
            </button>
            {error && <span className="errorMessage">{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {imgs.map((image, index) => (
          <div className="imageItem" key={index}>
            <img src={image} alt="" />
            <button
              className="removeImageBtn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setImgs((prev) => prev.filter((_, i) => i !== index));
              }}
              title={t("removeImage")}
              aria-label={t("removeImage")}
            >
              ✖
            </button>
          </div>
        ))}
        <UploadWidget uwConfig={memoUwConfig} setState={setImgs} />
      </div>
    </div>
  );
}

export default EditPostPage;


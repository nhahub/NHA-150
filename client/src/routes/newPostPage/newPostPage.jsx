import { useState, useMemo, useRef, useEffect, useContext } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UploadWidget from "../../components/uploadWidget/uploadWidget";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from '../../../context/languageContext';

function NewPostPage() {
  const { t } = useContext(LanguageContext);
  const [value,setValue]=useState("");
  const [error,setError]=useState("");
  const [imgs,setImgs]=useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const renderRef = useRef(0);
  renderRef.current += 1;

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  }), []);

  const formats = useMemo(() => [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "align", "link", "image"
  ], []);

  const memoUwConfig = useMemo(()=>({
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
    
    const formData=new FormData(e.target);
    const inputs=Object.fromEntries(formData);

    try{
      const res= await apiRequest.post("/posts",{
        postData:{
          title:inputs.title || "",
          price:parseInt(inputs.price) || 0,
          address:inputs.address || "",
          bedroom:parseInt(inputs.bedroom) || 0,
          bathroom:parseInt(inputs.bathroom) || 0,
          latitude:inputs.latitude || "",
          longitude:inputs.longitude || "",
          city:inputs.city || "",
          type:inputs.type || "",
          property:inputs.property || "",
          images:imgs, 
        },
        postDetail:{
          desc:value || "",
          utilities:inputs.utilities || "",
          pet:inputs.pet || "",
          income:inputs.income || "",
          size:parseInt(inputs.size) || 0,
          school:parseInt(inputs.school) || 0,
          bus:parseInt(inputs.bus) || 0,
          restaurant:parseInt(inputs.restaurant) || 0,
        }
      });
      navigate("/"+res.data.id);
      console.log("Post created:",res.data);
    }catch(err){
      console.log(err);
      setError(err.response?.data?.error || err.message || "Failed to create post");
      setIsSubmitting(false);
    }
  }


  return (
    
    <div className="newPostPage">
      <div className="formContainer">
        <h1>{t("addNewPost")}</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">{t("title")}</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">{t("price")}</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">{t("address")}</label>
              <input id="address" name="address" type="text" />
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
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">{t("bedroomNumber")}</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">{t("bathroomNumber")}</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">{t("latitude")}</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">{t("longitude")}</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">{t("type")}</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  {t("rent")}
                </option>
                <option value="buy">{t("buy")}</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">{t("property")}</label>
              <select name="property">
                <option value="apartment">{t("apartment")}</option>
                <option value="house">{t("house")}</option>
                <option value="condo">{t("condo")}</option>
                <option value="land">{t("land")}</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">{t("utilitiesPolicy")}</label>
              <select name="utilities">
                <option value="owner">{t("ownerResponsible")}</option>
                <option value="tenant">{t("tenantResponsible")}</option>
                <option value="shared">{t("shared")}</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">{t("petPolicyLabel")}</label>
              <select name="pet">
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
              />
            </div>
            <div className="item">
              <label htmlFor="size">{t("totalSize")} ({t("sqft")})</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">{t("schoolLabel")}</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">{t("bus")}</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">{t("restaurant")}</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  {t("loading")}...
                </>
              ) : (
                t("add")
              )}
            </button>
            {error && <span className="errorMessage">{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {imgs.map((image,index)=>
          <img src={image} key={index} alt="" />
        )}
        <UploadWidget uwConfig={memoUwConfig} setState={setImgs} />
      </div>
    </div>
  );
}

export default NewPostPage;

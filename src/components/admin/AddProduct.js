import React, { useState, useEffect } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/admin/categories"
        );
        if (Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", categoryId);
    formData.append("stock", stock);
    formData.append("image", image);

    try {
      await axios.post(
        "http://localhost:8081/admin/products/add-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Product added successfully");
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setStock("");
      setImage(null);
    } catch (error) {
      console.error("Error adding product", error);
      setMessage("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
            }}
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.Name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </form>
      <h3>Preview:</h3>
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}
      />
    </div>
  );
};

export default AddProduct;

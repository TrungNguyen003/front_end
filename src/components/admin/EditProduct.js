import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
    image: '',
    galleryImages: []
  });
  const [categories, setCategories] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/admin/products/edit-product/${id}`);
        const fetchedProduct = response.data.product;

        setProduct({
          ...fetchedProduct,
          // Format the price to VND
          price: fetchedProduct.price
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fetchedProduct.price)
            : '',
          category_id: fetchedProduct.category_id ? fetchedProduct.category_id._id : ''
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching product', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove VND formatting and commas when setting the price
    const strippedValue = name === 'price' ? value.replace(/[^\d]/g, '') : value;

    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: strippedValue
    }));
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleGalleryChange = (e) => {
    setGalleryFiles([...e.target.files]);
  };

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setProduct(prevProduct => ({
      ...prevProduct,
      description: data
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);

    // Convert the stripped price back to a number
    formData.append('price', parseFloat(product.price.replace(/[^\d]/g, '')));
    formData.append('category_id', product.category_id);
    formData.append('stock', product.stock);
    if (product.image) formData.append('image', product.image);

    try {
      await axios.post(`http://localhost:8081/admin/products/edit-product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (galleryFiles.length > 0) {
        const galleryFormData = new FormData();
        galleryFiles.forEach((file) => {
          galleryFormData.append('images', file);
        });

        await axios.post(`http://localhost:8081/admin/products/product-gallery/${id}`, galleryFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product', error);
    }
  };

  return (
    <div>
      <h2>Chỉnh sửa sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Mô tả</label>
          <CKEditor
            editor={ClassicEditor}
            data={product.description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div>
          <label>Giá</label>
          <input
            type="text"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Danh mục</label>
          <select name="category_id" value={product.category_id} onChange={handleChange} required>
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.Name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Kho hàng</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} required />
        </div>
        <div>
          <label>Hình ảnh</label>
          <input type="file" name="image" onChange={handleFileChange} />
        </div>
        <div>
          <label>Hình ảnh trưng bày</label>
          <input type="file" name="galleryImages" multiple onChange={handleGalleryChange} />
        </div>
        <button type="submit">Cập nhật sản phẩm</button>
      </form>
    </div>
  );
};

export default EditProduct;

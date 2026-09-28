import React, {
  useState,
  useEffect,
} from 'react';

import {
  Form,
  Button,
  Alert,
} from 'react-bootstrap';

import axios from 'axios';

import '../../css/product-form.css';

import type {
  Product,
  Category,
} from './productTypes';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSuccess,
  onCancel,
}) => {

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    discount: 0,
    quantity: 0,
    category_id: '',
    images: [] as string[],
    is_new: false,
  });

  const [imageUrls, setImageUrls] =
    useState<string[]>(['']);

  const [imageFiles, setImageFiles] =
    useState<File[]>([]);

  const [uploadingImages, setUploadingImages] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  // =========================
  // LOAD PRODUCT
  // =========================

  useEffect(() => {

    if (product) {

      let categoryId = '';

      // category_id là object
      if (
        product.category_id &&
        typeof product.category_id === 'object'
      ) {

        categoryId =
          product.category_id._id;

      }

      // category_id là string
      else if (
        typeof product.category_id === 'string'
      ) {

        categoryId =
          product.category_id;

      }

      setFormData({

        name:
          product.name || '',

        description:
          product.description || '',

        price:
          product.price || 0,

        discount:
          product.discount || 0,

        quantity:
          product.quantity || 0,

        category_id:
          categoryId,

        images:
          product.images || [],

        is_new:
          Boolean(product.is_new),

      });

      setImageUrls(
        product.images &&
        product.images.length > 0
          ? product.images
          : ['']
      );

      setImageFiles([]);

    } else {

      // Reset form

      setFormData({

        name: '',

        description: '',

        price: 0,

        discount: 0,

        quantity: 0,

        category_id: '',

        images: [],

        is_new: false,

      });

      setImageUrls(['']);

      setImageFiles([]);

    }

  }, [product]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
      type,
    } = e.target;

    const checked =
      (e.target as HTMLInputElement)
        .checked;

    let newValue:
      string | number | boolean;

    if (type === 'checkbox') {

      newValue = checked;

    } else if (
      name === 'price' ||
      name === 'discount' ||
      name === 'quantity'
    ) {

      newValue =
        Number(value);

    } else {

      newValue = value;

    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Lưu is_new ngay khi thay đổi
    if (
      type === 'checkbox' &&
      name === 'is_new' &&
      product
    ) {

      handleSaveIsNew(
        checked
      );

    }
  };

  // =========================
  // SAVE IS_NEW
  // =========================

  const handleSaveIsNew = async (
    isNew: boolean
  ) => {

    if (!product) {
      return;
    }

    try {

      const token =
        localStorage.getItem(
          'accessToken'
        );

      if (!token) {

        setError(
          'Vui lòng đăng nhập lại. Token không tồn tại.'
        );

        setFormData((prev) => ({
          ...prev,
          is_new: !isNew,
        }));

        return;
      }

      const headers = {
        Authorization:
          `Bearer ${token}`,

        'Content-Type':
          'application/json',
      };

      const response =
        await axios.put(
          `https://manguon-4d.onrender.com/api/products/${product._id}`,
          {
            is_new: isNew,
          },
          {
            headers,
          }
        );

      setFormData((prev) => ({
        ...prev,
        is_new:
          Boolean(
            response.data?.is_new ??
            isNew
          ),
      }));

      setError('');

      onSuccess();

    } catch (err: unknown) {

      console.error(
        'Lỗi cập nhật is_new:',
        err
      );

      let message =
        'Không thể cập nhật trạng thái hàng mới.';

      if (
        axios.isAxiosError(err)
      ) {

        message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          message;

      } else if (
        err instanceof Error
      ) {

        message =
          err.message;
      }

      setError(message);

      // Revert
      setFormData((prev) => ({
        ...prev,
        is_new: !isNew,
      }));
    }
  };

  // =========================
  // IMAGE URL
  // =========================

  const handleImageUrlChange = (
    index: number,
    value: string
  ) => {

    const newUrls =
      [...imageUrls];

    newUrls[index] =
      value;

    setImageUrls(newUrls);
  };

  // =========================
  // ADD IMAGE URL
  // =========================

  const addImageUrl = () => {

    setImageUrls([
      ...imageUrls,
      '',
    ]);
  };

  // =========================
  // REMOVE IMAGE URL
  // =========================

  const removeImageUrl = (
    index: number
  ) => {

    const newUrls =
      imageUrls.filter(
        (_, i) =>
          i !== index
      );

    setImageUrls(
      newUrls.length > 0
        ? newUrls
        : ['']
    );
  };

  // =========================
  // FILE CHANGE
  // =========================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files) {
      return;
    }

    const files =
      Array.from(
        e.target.files
      );

    setImageFiles(
      (prev) => [
        ...prev,
        ...files,
      ]
    );
  };

  // =========================
  // REMOVE FILE
  // =========================

  const removeImageFile = (
    index: number
  ) => {

    setImageFiles(
      (prev) =>
        prev.filter(
          (_, i) =>
            i !== index
        )
    );
  };

  // =========================
  // UPLOAD IMAGES
  // =========================

  const uploadImages = async (
    files: File[]
  ): Promise<string[]> => {

    if (
      files.length === 0
    ) {

      return [];
    }

    const uploadData =
      new FormData();

    files.forEach(
      (file) => {
        uploadData.append(
          'images',
          file
        );
      }
    );

    const token =
      localStorage.getItem(
        'accessToken'
      );

    const response =
      await axios.post(
        'https://manguon-4d.onrender.com/api/products/upload',
        uploadData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            'Content-Type':
              'multipart/form-data',
          },
        }
      );

    return (
      response.data.images || []
    ).map(
      (img: string) => {

        if (
          img.startsWith(
            'http://'
          ) ||
          img.startsWith(
            'https://'
          )
        ) {

          return img;
        }

        return `https://manguon-2.onrender.com${img}`;
      }
    );
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError('');
    setLoading(true);
    setUploadingImages(true);

    try {

      // =========================
      // UPLOAD FILES
      // =========================

      let uploadedImageUrls:
        string[] = [];

      if (
        imageFiles.length > 0
      ) {

        uploadedImageUrls =
          await uploadImages(
            imageFiles
          );
      }

      // =========================
      // IMAGE URLS
      // =========================

      const validImageUrls =
        imageUrls.filter(
          (url) =>
            url.trim() !== ''
        );

      const allImages = [
        ...validImageUrls,
        ...uploadedImageUrls,
      ];

      // =========================
      // SUBMIT DATA
      // =========================

      const submitData: {
        name: string;
        description: string;
        price: number;
        discount: number;
        quantity: number;
        images: string[];
        is_new: boolean;
        category_id?: string;
      } = {

        name:
          formData.name.trim(),

        description:
          formData.description || '',

        price:
          Number(formData.price) || 0,

        discount:
          Number(formData.discount) || 0,

        quantity:
          Number(formData.quantity) || 0,

        images:
          allImages,

        is_new:
          Boolean(
            formData.is_new
          ),
      };

      // =========================
      // CATEGORY
      // =========================

      if (
        formData.category_id &&
        formData.category_id.trim()
      ) {

        submitData.category_id =
          formData.category_id;
      }

      // =========================
      // TOKEN
      // =========================

      const token =
        localStorage.getItem(
          'accessToken'
        );

      if (!token) {

        setError(
          'Vui lòng đăng nhập lại.'
        );

        return;
      }

      const headers = {

        Authorization:
          `Bearer ${token}`,

        'Content-Type':
          'application/json',
      };

      // =========================
      // UPDATE
      // =========================

      if (product) {

        await axios.put(
          `https://manguon-4d.onrender.com/api/products/${product._id}`,
          submitData,
          {
            headers,
          }
        );

      }

      // =========================
      // CREATE
      // =========================

      else {

        await axios.post(
          'https://manguon-4d.onrender.com/api/products',
          submitData,
          {
            headers,
          }
        );
      }

      // =========================
      // SUCCESS
      // =========================

      onSuccess();

    } catch (err: unknown) {

      console.error(
        'Lỗi khi lưu sản phẩm:',
        err
      );

      let message =
        'Có lỗi xảy ra khi lưu sản phẩm.';

      if (
        axios.isAxiosError(err)
      ) {

        message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          message;

      } else if (
        err instanceof Error
      ) {

        message =
          err.message;
      }

      setError(message);

    } finally {

      setLoading(false);
      setUploadingImages(false);
    }
  };

  // =========================
  // RENDER
  // =========================

  return (

    <Form
      onSubmit={handleSubmit}
    >

      {/* ERROR */}

      {error && (

        <Alert
          variant="danger"
          dismissible
          onClose={() =>
            setError('')
          }
        >
          {error}
        </Alert>

      )}

      {/* =========================
          NAME
      ========================= */}

      <Form.Group className="mb-3">

        <Form.Label>
          Tên sản phẩm *
        </Form.Label>

        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Nhập tên sản phẩm"
        />

      </Form.Group>

      {/* =========================
          DESCRIPTION
      ========================= */}

      <Form.Group className="mb-3">

        <Form.Label>
          Mô tả
        </Form.Label>

        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={
            formData.description
          }
          onChange={handleChange}
          placeholder="Nhập mô tả sản phẩm"
        />

      </Form.Group>

      {/* =========================
          PRICE / DISCOUNT / QUANTITY
      ========================= */}

      <div className="row">

        <Form.Group
          className="mb-3 col-md-4"
        >

          <Form.Label>
            Giá *
          </Form.Label>

          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="1000"
          />

        </Form.Group>

        <Form.Group
          className="mb-3 col-md-4"
        >

          <Form.Label>
            Giảm giá (%)
          </Form.Label>

          <Form.Control
            type="number"
            name="discount"
            value={
              formData.discount
            }
            onChange={handleChange}
            min="0"
            max="100"
          />

        </Form.Group>

        <Form.Group
          className="mb-3 col-md-4"
        >

          <Form.Label>
            Số lượng *
          </Form.Label>

          <Form.Control
            type="number"
            name="quantity"
            value={
              formData.quantity
            }
            onChange={handleChange}
            required
            min="0"
          />

        </Form.Group>

      </div>

      {/* =========================
          CATEGORY
      ========================= */}

      <Form.Group className="mb-3">

        <Form.Label>
          Danh mục
        </Form.Label>

        <Form.Select
          name="category_id"
          value={
            formData.category_id
          }
          onChange={handleChange}
        >

          <option value="">
            Chọn danh mục
          </option>

          {categories.map(
            (category) => (

              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>

            )
          )}

        </Form.Select>

      </Form.Group>

      {/* =========================
          IMAGES
      ========================= */}

      <Form.Group className="mb-3">

        <Form.Label>
          Hình ảnh
        </Form.Label>

        {/* UPLOAD FILE */}

        <div className="mb-3">

          <Form.Label>
            Tải ảnh từ máy tính
          </Form.Label>

          <Form.Control
            type="file"
            accept="image/*"
            multiple
            onChange={
              handleFileChange
            }
          />

          {imageFiles.length > 0 && (

            <div className="d-flex flex-wrap gap-2 mt-3">

              {imageFiles.map(
                (file, index) => (

                  <div
                    key={index}
                    className="position-relative"
                  >

                    <img
                      src={URL.createObjectURL(
                        file
                      )}
                      alt={
                        `Preview ${index + 1}`
                      }
                      className="product-image-preview"
                    />

                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      onClick={() =>
                        removeImageFile(
                          index
                        )
                      }
                    >
                      ×
                    </Button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* IMAGE URL */}

        <div>

          <Form.Label>
            Hoặc nhập URL hình ảnh
          </Form.Label>

          {imageUrls.map(
            (url, index) => (

              <div
                key={index}
                className="d-flex mb-2"
              >

                <Form.Control
                  type="url"
                  value={url}
                  onChange={(e) =>
                    handleImageUrlChange(
                      index,
                      e.target.value
                    )
                  }
                  placeholder={
                    `URL hình ảnh ${index + 1}`
                  }
                  className="me-2"
                />

                {imageUrls.length > 1 && (

                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    onClick={() =>
                      removeImageUrl(
                        index
                      )
                    }
                  >
                    Xóa
                  </Button>

                )}

              </div>

            )
          )}

          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            onClick={
              addImageUrl
            }
          >
            + Thêm URL
          </Button>

        </div>

      </Form.Group>

      {/* =========================
          IS NEW
      ========================= */}

      <Form.Group className="mb-3">

        <Form.Check
          type="checkbox"
          name="is_new"
          label="Đánh dấu là hàng mới"
          checked={
            Boolean(
              formData.is_new
            )
          }
          onChange={
            handleChange
          }
        />

      </Form.Group>

      {/* =========================
          BUTTONS
      ========================= */}

      <div className="d-flex justify-content-end gap-2">

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </Button>

        <Button
          variant="primary"
          type="submit"
          disabled={
            loading ||
            uploadingImages
          }
        >

          {uploadingImages
            ? 'Đang tải ảnh...'
            : loading
            ? 'Đang lưu...'
            : 'Lưu'}

        </Button>

      </div>

    </Form>
  );
};

export default ProductForm;
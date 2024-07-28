import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../../utils/constant.js';

const ThirdSection = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productsResponse = await axios.get(`${URL}/api/product/get-all`);
        const categoriesResponse = await axios.get(`${URL}/api/category/get-all`);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products and categories:', error);
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const getProductsByCategory = (categoryId) => {
    return products.filter(product => product.category_id === categoryId).slice(0, 4);
  };

  const truncateDescription = (description) => {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid fruite py-5">
      <div className="container py-5">
        <div className="tab-class text-center">
          <div className="row g-4">
            <div className="col-lg-4 text-start">
              <h1>Đa dạng các loại bánh</h1>
            </div>
            <div className="col-lg-8 text-end">
              <ul className="nav nav-pills d-inline-flex text-center mb-5">
                <li className="nav-item">
                  <a className="d-flex m-2 py-2 bg-light rounded-pill active" data-bs-toggle="pill" href="#tab-all">
                    <span className="text-dark" style={{ width: '130px'}}>All</span>
                  </a>
                </li>
                {categories.map(category => (
                  <li className="nav-item" key={category.category_id}>
                    <a className="d-flex py-2 m-2 bg-light rounded-pill" data-bs-toggle="pill" href={`#tab-${category.category_id}`}>
                      <span className="text-dark" style={{ width: '130px'}}>{category.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-all" className="tab-pane fade show active p-0">
              <div className="row g-4">
                {products.slice(0, 4).map(product => (
                  <div className="col-md-6 col-lg-4 col-xl-3" key={product.product_id}>
                    <div className="rounded position-relative fruite-item">
                      <div className="fruite-img">
                        <img src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} className="img-fluid w-100 rounded-top" alt="" />
                      </div>
                      <div className="text-white bg-secondary px-3 py-1 rounded position-absolute" style={{ top: '10px', left: '10px'}}>{product.category_name}</div>
                      <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                        <h4>{product.name}</h4>
                        <p>{truncateDescription(product.description)}</p>
                        <div className="d-flex justify-content-between flex-lg-wrap">
                          <p className="text-dark fs-5 fw-bold mb-0">{product.price} ₫</p>
                          <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {categories.map(category => (
              <div id={`tab-${category.category_id}`} className="tab-pane fade p-0" key={category.category_id}>
                <div className="row g-4">
                  {getProductsByCategory(category.category_id).map(product => (
                    <div className="col-md-6 col-lg-4 col-xl-3" key={product.product_id}>
                      <div className="rounded position-relative fruite-item">
                        <div className="fruite-img">
                          <img src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} className="img-fluid w-100 rounded-top" alt="" />
                        </div>
                        <div className="text-white bg-secondary px-3 py-1 rounded position-absolute" style={{ top: '10px', left: '10px'}}>{category.name}</div>
                        <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                          <h4>{product.name}</h4>
                          <p>{truncateDescription(product.description)}</p>
                          <div className="d-flex justify-content-between flex-lg-wrap">
                            <p className="text-dark fs-5 fw-bold mb-0">{product.price} ₫</p>
                            <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdSection;

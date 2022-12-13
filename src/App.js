import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import CategoryList from "./CategoryList";
import Navi from "./Navi";
import ProductList from "./ProductList";
import alertify from "alertifyjs";
import { Route, Routes } from "react-router-dom";
import Error404 from "./App";
import CartList from "./CartList";
import FormDemo1 from "./FormDemo1";
export default class App extends Component {
  state = { currentCategory: [], products: [], cart: [] };

  componentDidMount() {
    this.getProducts();
  }
  //arrow func
  changeCategory = (category) => {
    this.setState({ currentCategory: category.CategoryName });
    this.getProducts(category.id);
  };

  getProducts = (categoryId) => {
    let url = "http://localhost:3000/products";
    if (categoryId) {
      url += "?categoryId=" + categoryId;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => this.setState({ products: data }));
  };
  addToCart = (product) => {
    let newCart = this.state.cart;
    var addedItem = newCart.find((c) => c.product.id === product.id);
    if (addedItem) {
      addedItem.quantity += 1;
    } else {
      newCart.push({ product: product, quantity: 1 });
    }
    this.setState({ cart: newCart });
    alertify.success(product.productName + "added to cart!", 2); //uyarı mesajı
  };

  removeFromCart = (product) => {
    let newcart = this.state.cart.filter((c) => c.product.id !== product.id);
    //bir arrayda verilen şarta göre filtreleme yaptık.
    this.setState({ cart: newcart });
  };

   Error404() {
    return (
        <div>
          <h2>Aradığınız Sayfa Bulunamadı</h2>
        </div>
    )
  }
  render() {
    let productInfo = { title: "Product List" };
    let categoryInfo = { title: "Category List" };
    return (
      <div>
        <Container>
          <Navi removeFromCart={this.removeFromCart} cart={this.state.cart} />
          <Row>
            <Col xs="3">
              <CategoryList
                currentCategory={this.state.currentCategory}
                changeCategory={this.changeCategory}
                info={categoryInfo}
              />
            </Col>
            <Col xs="9">
              <Routes>
                <Route 
                exact path="/"
                  >
                    
                  </Route>
                <Route exact path="/cart" component={<CartList/>} />
                <Route path="/form1" component={<FormDemo1/>}></Route>
                <Route path='*' component={<Error404/>} />
                
              </Routes>
              <ProductList
                      products={this.state.products}
                      addToCart={this.addToCart}
                      currentCategory={this.state.currentCategory}
                      changeCategory={this.changeCategory}
                      info={productInfo}
                    />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

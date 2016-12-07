class ProviderConnector {
  constructor(options) {
    this.options = options;
  }

  connect() {
    // connect to provider
  }

  getSingleProduct(id) {
    return {};
  }

  getCategories() {
    return [];
  }

  getProductsByCategory(categoryId, page) {
    return [];
  }

  _parseJSON(product) {
    return product;
  }
}

export default ProviderConnector;

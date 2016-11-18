import walmart from 'walmart';
import ProviderConnector from './ProviderConnector';
import Promise from 'bluebird';

class WalmartConnector extends ProviderConnector  {
  constructor(options) {
    super(options);
    this.connect();
  }

  connect() {
    this.walmartClient = walmart(this.options.apiKey);
  }

  getSingleProduct(id) {
    return {};
  }

  getCategories() {
    return this.walmartClient.taxonomy();
  }

  getProductsByCategory(categoryId) {
    return [];
  }

  getPaginatedProductsByCategory(categoryId, maxId) {
    const args = {};
    if (maxId) {
      args.productId = maxId;
    }
    return this.walmartClient.paginateByCategory(categoryId, args);
  }

  getPaginatedProductsByBrand(brandId, maxId) {
    const args = {};
    if (maxId) {
      args.productId = maxId;
    }
    return this.walmartClient.paginateByBrand(categoryId, args);
  }
}

export default WalmartConnector;

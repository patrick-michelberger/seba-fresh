import walmart from 'walmart-api';
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
    return this.walmartClient.getItem(id).then((response) => {
      return this._parseJSON(response.product);
    });
  }

  getCategories() {
    return this.walmartClient.taxonomy();
  }

  getProductsByCategory(categoryId, page) {
    return this._getPaginatedProductsByCategory(categoryId, page);
  }

  _getPaginatedProductsByCategory(categoryId, maxId) {
    const args = {};
    const self = this;
    if (maxId) {
      args.productId = maxId;
    }
    return this.walmartClient.paginateByCategory(categoryId, args).then((response) => {
      return response.items.map(self._parseJSON);
    });
  }

  _getPaginatedProductsByBrand(brandId, maxId) {
    const args = {};
    if (maxId) {
      args.productId = maxId;
    }
    return this.walmartClient.paginateByBrand(categoryId, args);
  }

  _parseJSON(product) {
    return {
      id: product.itemId,
      name: product.name,
      price: product.msrp || product.salePrice || false,
      salePrice: product.salePrice || false,
      upc: product.upc || false,
      categoryPath: product.categoryPath,
      categoryNode: product.categoryNode,
      description: product.shortDescription || product.longDescription ||  "",
      brand: product.brandName || "",
      thumbnailImage: product.thumbnailImage || false,
      mediumImage: product.mediumImage || false,
      largeImage: product.largeImage || false,
      productUrl: product.productUrl,
      sale: product.salePrice < product.msrp,
      stock: true,
      addToCartUrl: product.addToCartUrl || false,
      productUrl: product.productUrl,
      vendor: "walmart"
    };
  }
}

export default WalmartConnector;

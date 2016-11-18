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

    getProductsByCategory(categoryId) {
        return [];
    }
}

export default ProviderConnector;

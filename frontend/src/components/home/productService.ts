export const ProductService = {
  getProductsData() {
      return [
          {
              id: '1000',
              code: 'f230fh0g3',
              name: 'Munnar',
              description: 'Product Description',
              image: 'https://images.pexels.com/photos/13045091/pexels-photo-13045091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              price: 65,
              category: 'Accessories',
              quantity: 24,
              inventoryStatus: 'INSTOCK',
              rating: 5
          },
          {
              id: '1001',
              code: 'nvklal433',
              name: 'Black Watch',
              description: 'Product Description',
              image: 'https://images.pexels.com/photos/14658834/pexels-photo-14658834.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
              price: 72,
              category: 'Accessories',
              quantity: 61,
              inventoryStatus: 'INSTOCK',
              rating: 4
          },
          {
              id: '1002',
              code: 'zz21cz3c1',
              name: 'Blue Band',
              description: 'Product Description',
              image: 'https://images.pexels.com/photos/14658834/pexels-photo-14658834.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
              price: 79,
              category: 'Fitness',
              quantity: 2,
              inventoryStatus: 'LOWSTOCK',
              rating: 3
          },
          {
              id: '1003',
              code: '244wgerg2',
              name: 'Blue T-Shirt',
              description: 'Product Description',
              image: 'https://images.pexels.com/photos/14658834/pexels-photo-14658834.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
              price: 29,
              category: 'Clothing',
              quantity: 25,
              inventoryStatus: 'INSTOCK',
              rating: 5
          },
          {
            id: '1003',
            code: '244wgerg2',
            name: 'Blue T-Shirt',
            description: 'Product Description',
            image: 'https://images.pexels.com/photos/14658834/pexels-photo-14658834.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            price: 29,
            category: 'Clothing',
            quantity: 25,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1003',
            code: '244wgerg2',
            name: 'Blue T-Shirt',
            description: 'Product Description',
            image: 'https://images.pexels.com/photos/14658834/pexels-photo-14658834.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            price: 29,
            category: 'Clothing',
            quantity: 25,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
      ];
  },

  getProductsMini() {
      return Promise.resolve(this.getProductsData().slice(0, 5));
  },

  getProductsSmall() {
      return Promise.resolve(this.getProductsData().slice(0, 10));
  },

  getProducts() {
      return Promise.resolve(this.getProductsData());
  },

};


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  discount?: number;
  image: string;
  category: string;
  brand: string;
}

interface Category {
  id: string;
  name: string;
  selected: boolean;
}

interface Brand {
  id: string;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  // Carousel
  currentSlide = 0;
  carouselTimer: any;

  // Filters
  selectedPriceMin = 500;
  selectedPriceMax = 3000;
  priceRange = { min: 500, max: 3000 };

  categories: Category[] = [
    { id: 'gaming', name: 'Gaming', selected: false },
    { id: 'business', name: 'Negocios', selected: false },
    { id: 'ultrabook', name: 'Ultrabooks', selected: false },
    { id: '2in1', name: '2 en 1', selected: false },
    { id: 'budget', name: 'Económicas', selected: false }
  ];

  brands: Brand[] = [
    { id: 'asus', name: 'Asus', selected: false },
    { id: 'lenovo', name: 'Lenovo', selected: false },
    { id: 'hp', name: 'HP', selected: false },
    { id: 'acer', name: 'Acer', selected: false },
    { id: 'msi', name: 'MSI', selected: false },
    { id: 'macbook', name: 'MacBook', selected: false },
    { id: 'dell', name: 'Dell', selected: false }
  ];

  products: Product[] = [
    {
      id: 1,
      name: 'MacBook Pro 2025',
      description: 'M3 Pro, 32GB RAM, 1TB SSD',
      price: '2,499',
      oldPrice: '2,699',
      discount: 7,
      image: 'https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_1280.jpg',
      category: 'ultrabook',
      brand: 'macbook'
    },
    {
      id: 2,
      name: 'ASUS ROG Zephyrus',
      description: 'Intel i9, RTX 4080, 64GB RAM',
      price: '1,999',
      oldPrice: '2,299',
      discount: 13,
      image: 'https://cdn.discordapp.com/attachments/1111808588231479369/1378309133069189281/s-l960-4_1.jpg?ex=683c21e9&is=683ad069&hm=c30362e96002539210165fb2221fe8063def47a81221a652467ca0579b2a10a9&',
      category: 'gaming',
      brand: 'asus'
    },
    {
      id: 3,
      name: 'Dell XPS 15',
      description: 'Intel i7, 16GB RAM, 512GB SSD',
      price: '1,499',
      image: 'https://cdn.discordapp.com/attachments/1111808588231479369/1378306601475244103/664253_549592_03_front_zoom.png?ex=683c1f8d&is=683ace0d&hm=f27ecd5c731addc8b684ee5d3e1b6e160c2188a047c274c3c2f8992411b2bb82&',
      category: 'business',
      brand: 'dell'
    },
    {
      id: 4,
      name: 'Lenovo ThinkPad X1',
      description: 'Intel i5, 16GB RAM, 256GB SSD',
      price: '1,299',
      oldPrice: '1,399',
      discount: 7,
      image: 'https://cdn.discordapp.com/attachments/1111808588231479369/1378307608271913010/s-l960.png?ex=683c207d&is=683acefd&hm=2a46f5767690485d2640925f52bea45d6c783359dcf781c3e6b235b65deaf8c7&',
      category: 'business',
      brand: 'lenovo'
    },
    {
      id: 5,
      name: 'HP Spectre x360',
      description: 'Intel i7, 16GB RAM, 1TB SSD',
      price: '1,399',
      oldPrice: '1,599',
      discount: 12,
      image: 'https://cdn.discordapp.com/attachments/1111808588231479369/1378307835083100290/6576933_rd-1.png?ex=683c20b3&is=683acf33&hm=20c1aa8cb60a742f7231029a9f70e605862e380efb946ad98caf8e37c93e393c&',
      category: '2in1',
      brand: 'hp'
    },
    {
      id: 6,
      name: 'Acer Predator Helios',
      description: 'AMD Ryzen 9, RTX 4070, 32GB RAM',
      price: '1,799',
      image: 'https://cdn.discordapp.com/attachments/1111808588231479369/1378308703576653905/6541302ld.jpg?ex=683c2182&is=683ad002&hm=20c6ceb10849ef67cfcef7aee386aa87c15a1819b669dc928531c1eba6227028&',
      category: 'gaming',
      brand: 'acer'
    }
  ];

  filteredProducts: Product[] = [];
  favorites: number[] = [];

  ngOnInit() {
    this.filteredProducts = [...this.products];
    this.startCarousel();
    this.loadFavorites();
  }

  ngOnDestroy() {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }

  // Carousel methods
  startCarousel() {
    this.carouselTimer = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === 1 ? 0 : 1;
  }

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? 1 : 0;
  }

  // Filter methods
  onCategoryChange() {
    this.applyFilters();
  }

  onBrandChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Filter by price
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price.replace(',', ''));
      return price >= this.selectedPriceMin && price <= this.selectedPriceMax;
    });

    // Filter by categories
    const selectedCategories = this.categories
      .filter(cat => cat.selected)
      .map(cat => cat.id);

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Filter by brands
    const selectedBrands = this.brands
      .filter(brand => brand.selected)
      .map(brand => brand.id);

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    this.filteredProducts = filtered;
  }

  // Product actions
  onViewProduct(productId: number) {
    console.log('View product:', productId);
    // Implementar modal de detalles del producto
  }

  onAddToCart(productId: number) {
    console.log('Add to cart:', productId);
    // Implementar lógica del carrito
  }

  onToggleFavorite(productId: number) {
    const index = this.favorites.indexOf(productId);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(productId);
    }
    this.saveFavorites();
  }

  isFavorite(productId: number): boolean {
    return this.favorites.includes(productId);
  }

  // Carousel button actions
  onViewOffers() {
    console.log('View offers clicked');
  }

  onDiscover() {
    console.log('Discover clicked');
  }

  // Local storage methods
  private loadFavorites() {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      this.favorites = JSON.parse(stored);
    }
  }

  private saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }
}

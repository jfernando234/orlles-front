import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
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
      image: 'https://i.ibb.co/8WhDT8Y/Mac-Book-Pro-2025.jpg',
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
      image: 'https://i.ibb.co/4wXMCD2B/azus-rog.jpg',
      category: 'gaming',
      brand: 'asus'
    },
    {
      id: 3,
      name: 'Dell XPS 15',
      description: 'Intel i7, 16GB RAM, 512GB SSD',
      price: '1,499',
      image: 'https://i.ibb.co/SwWFLTnt/Dell-XPS-15.png',
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
      image: 'https://p3-ofp.static.pub//fes/cms/2024/07/05/05dhzg0lrtq4i0d3wxqyjjakwmbmzr331426.png',
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
      image: 'https://i.ibb.co/x8RkLcxj/HP-Spectre-x360.png',
      category: '2in1',
      brand: 'hp'
    },
    {
      id: 6,
      name: 'Acer Predator Helios',
      description: 'AMD Ryzen 9, RTX 4070, 32GB RAM',
      price: '1,799',
      image: 'https://i.ibb.co/DP9ZFdxR/Acer-Predator-Helios.jpg',
      category: 'gaming',
      brand: 'acer'
    },
    {
      id: 7,
      name: 'ROG Zephyrus G14 (2025)',
      description: 'AMD Ryzen 9 2700S, NVIDIA GeForce RTX 5070, 8GB RAM',
      price: '2,099',
      oldPrice: '3,499',
      discount: 6,
      image: 'https://i.ibb.co/39wcVjLL/ROG-Zephyrus.png',
      category: 'gaming',
      brand: 'msi'
    },
    {
      id: 8,
      name: 'Lenovo IdeaPad 3',
      description: 'AMD Ryzen 5, 8GB RAM, 256GB SSD',
      price: '599',
      image: '',
      category: 'budget',
      brand: 'lenovo'
    },
    {
      id: 9,
      name: 'HP Pavilion 15',
      description: 'Intel i5, 8GB RAM, 512GB SSD',
      price: '699',
      image: '',
      category: 'budget',
      brand: 'hp'
    },
    {
      id: 10,
      name: 'Acer Aspire 5',
      description: 'Intel i3, 4GB RAM, 128GB SSD',
      price: '499',
      image: '',
      category: 'budget',
      brand: 'acer'
    },
    {
      id: 11,
      name: 'Dell Inspiron 15',
      description: 'Intel i5, 8GB RAM, 256GB SSD',
      price: '749',
      image: '',
      category: 'budget',
      brand: 'dell'
    },
    {
      id: 12,
      name: 'MacBook Air 2024',
      description: 'M2 chip, 8GB RAM, 256GB SSD',
      price: '1,099',
      oldPrice: '1,199',
      discount: 8,
      image: '',
      category: 'ultrabook',
      brand: 'macbook'
    },
    {
      id: 13,
      name: 'Asus ZenBook 14',
      description: 'Intel i7, 16GB RAM, 512GB SSD',
      price: '1,199',
      image: '',
      category: 'ultrabook',
      brand: 'asus'
    },
    {
      id: 14,
      name: 'Lenovo Yoga 9i',
      description: 'Intel i7, 16GB RAM, 1TB SSD',
      price: '1,499',
      oldPrice: '1,699',
      discount: 12,
      image: '',
      category: '2in1',
      brand: 'lenovo'
    },
    {
      id: 15,
      name: 'HP Envy x360',
      description: 'AMD Ryzen 7, 16GB RAM, 512GB SSD',
      price: '1,299',
      image: '',
      category: '2in1',
      brand: 'hp'
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

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProductoComponent } from "../../commom-/card-producto/card-producto.component";
import { ProductoService } from '../../../shared/services/producto.services';
import { IProducto } from '../../../shared/models/producto';


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
  imports: [CommonModule, CardProductoComponent],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  // Carousel
  currentSlide = 0;
  carouselTimer: any;
  slideActual = 0;
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
  imagenes = [
    {
      src: 'assets/images/1-4.png',
      alt: 'Modelo 1',
    },
    {
      src: 'assets/images/1-5.png',
      alt: 'Modelo 2',

    },
    {
      src: 'assets/images/2-4.png',
      alt: 'Modelo 3',

    },
    {
      src: 'assets/images/3-4.png',
      alt: 'Modelo 4',
    }
  ];

  productos: IProducto[] = [];
  favorites: number[] = [];
  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      this.productos.forEach(p => {
      if (p.ID_producto != null) {
        console.log('Producto:', p.ID_producto, 'URL Imagen:', this.getImagenUrl(p.ID_producto));
      } else {
        console.log('Producto:', p.ID_producto, 'URL Imagen: undefined');
      }
    });
    });
    this.startCarousel();
    this.loadFavorites();
  }
  @Input() getImagenUrl!: (ID_producto: number) => string;
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
     this.slideActual = (this.slideActual + 1) % this.imagenes.length;
  }

  previousSlide() {
    this.slideActual = (this.slideActual - 1 + this.imagenes.length) % this.imagenes.length;
  }

  // Filter methods
  onCategoryChange() {

  }

  onBrandChange() {

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
    console.log("Descubrir más sobre:", this.imagenes[this.slideActual]);
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

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  descripcion?: string;
  categoria?: string;
}
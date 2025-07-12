export class Producto {
  nombre = "Producto 1";
  marca ="";
  especificaciones ="";
  precioUnitario = 0;
  proveedor="";// o el objeto proveedor completo según tu modelo
  stockMinimo= 10;
}
export interface DataProducto {
    totalData: number;
    data: IProducto[];
}
//listar priductos
export interface IProducto {
  id: number;
  nombre: string;
  marca: string;
  especificaciones: string;
  precioUnitario: number;
  idproveedor: number;
  stockMinimo: number;
  imagen: string;
}
//guardarproducto
export interface IProductoC {
  id?: number;
  nombre: string;
  marca: string;
  especificaciones: string;
  precioUnitario: number;
  idproveedor: number;
  stockMinimo?: number;
  imagen?: string;
}

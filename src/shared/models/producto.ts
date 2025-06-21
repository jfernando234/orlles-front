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
export interface IProducto {
  ID_producto?: number; // Opcional, ya que puede ser autogenerado
  nombre: string;
  marca: string;
  especificaciones: string;
  precio: number;
  idproveedor: number;
  Stock?: number;
}

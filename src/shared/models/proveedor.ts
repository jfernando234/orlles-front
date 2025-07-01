export class Proveedor {
  nombre = '';
  pais = '';
  contacto = '';
  correo = '';
  telefono =0;
  tiempoentrega= 0;
  estado=0;
  certificaciones = '';
}
export interface DataProveedor {
  totalData: number;
  data: IProveedor[];
}
export interface IProveedor {
  nombre: string,
  pais: string,
  contacto: string,
  correoElectronico: string,
  telefono: number,
  tiempoentrega: number,
  estado: number,
  certificaciones: string
}

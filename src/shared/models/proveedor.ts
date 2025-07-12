export class Proveedor {
  nombre = '';
  pais = '';
  contacto = '';
  correo = '';
  telefono =0;
  estado=0;
}
export interface DataProveedor {
  totalData: number;
  data: IProveedor[];
}
export interface IProveedor {
  id?: number; // Agregada la propiedad id
  nombre: string,
  pais: string,
  contacto: string,
  correoElectronico: string,
  telefono: number,
  estado: number
}

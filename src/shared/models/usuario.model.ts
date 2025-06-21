export interface Usuario {
  id?: number;
  correoElectronico?: string;
  nombre?: string;
  apellidos?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  celular?: string;
  contrasena?: string;
  rol?: string;
  rol_id?: number;
  fecha_registro?: string;
  habilitado?: boolean;
  roles?: { idrol: number; nombre: string }[];
  
  // Mantener compatibilidad con nombres anteriores
  nombreUsuario?: string;
  correo?: string;
  nombreCompleto?: string;
  nombre_completo?: string;
  correo_electronico?: string;
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  precioOriginal?: number;
  descuento?: number;
  cantidad: number;
  imagen: string;
  color?: string;
  selected?: boolean;
}

// Validadores personalizados
export class CustomValidators {
  static onlyLetters(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!onlyLettersRegex.test(value)) {
      return { onlyLetters: true };
    }
    return null;
  }
  
  static peruDNI(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Debe tener exactamente 8 dígitos
    if (!/^\d{8}$/.test(value)) {
      return { invalidDNI: true };
    }
    
    // No debe empezar con 0
    if (value.startsWith('0')) {
      return { invalidDNI: true };
    }
    
    // No debe ser un patrón muy simple (números consecutivos o repetidos)
    const consecutivePattern = /^(01234567|12345678|23456789|87654321|76543210|65432109|54321098|43210987|32109876|21098765|10987654)$/;
    if (consecutivePattern.test(value)) {
      return { invalidDNI: true };
    }
    
    // No debe tener todos los dígitos iguales
    const allSameDigits = /^(\d)\1{7}$/;
    if (allSameDigits.test(value)) {
      return { invalidDNI: true };
    }
    
    // Validación adicional: no debe ser menor a 10000000 (muy bajo)
    const numValue = parseInt(value);
    if (numValue < 10000000) {
      return { invalidDNI: true };
    }
    
    return null;
  }
  
  static carnetExtranjeria(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Carnet de Extranjería: 9 dígitos que empiezan con 0
    if (!/^0\d{8}$/.test(value)) {
      return { invalidCarnet: true };
    }
    
    return null;
  }
  
  static passport(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Pasaporte: 9 caracteres alfanuméricos
    if (!/^[A-Z0-9]{9}$/.test(value.toUpperCase())) {
      return { invalidPassport: true };
    }
    
    return null;
  }
  
  // Validador dinámico que usa el tipo de documento
  static dynamicDocumentValidator(tipoDocumento: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      switch (tipoDocumento) {
        case 'DNI':
          return CustomValidators.peruDNI(control);
        case 'CE':
          return CustomValidators.carnetExtranjeria(control);
        case 'PASSPORT':
          return CustomValidators.passport(control);
        default:
          return null;
      }
    };
  }
  
  static peruPhone(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const phoneRegex = /^9\d{8}$/;
    if (!phoneRegex.test(value)) {
      return { invalidPhone: true };
    }
    return null;
  }
  
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    const hasMinLength = value.length >= 8;
    
    const errors: any = {};
    
    if (!hasUpperCase) errors.missingUpperCase = true;
    if (!hasNumber) errors.missingNumber = true;
    if (!hasSpecialChar) errors.missingSpecialChar = true;
    if (!hasMinLength) errors.minLength = true;
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  searchTerm = '';
  showLoginModal = false;
  showRegisterModal = false;
  showCartModal = false;
  showCheckoutModal = false;
  showAddressModal = false;
  selectedDeliveryType: string | null = null;
  deliveryAddress: string = '';
  
  // Propiedades para el formulario de dirección
  selectedDepartamento: string = '';
  selectedProvincia: string = '';
  selectedDistrito: string = '';
  provincias: {name: string, value: string}[] = [];
  distritos: {name: string, value: string}[] = [];
  avenida: string = '';
  numero: string = '';
  referencias: string = '';

  // Datos de departamentos, provincias y distritos de Perú
  public ubicacionesData: any = {
    amazonas: {
      name: 'Amazonas',
      provincias: {
        chachapoyas: {
          name: 'Chachapoyas',
          distritos: ['Chachapoyas', 'Asunción', 'Balsas', 'Cheto', 'Chiliquín', 'Chuquibamba', 'Granada', 'Huancas', 'La Jalca', 'Leimebamba', 'Levanto', 'Magdalena', 'Mariscal Castilla', 'Molinopampa', 'Montevideo', 'Olleros', 'Quinjalca', 'San Francisco de Daguas', 'San Isidro de Maino', 'Soloco', 'Sonche']
        },
        bagua: {
          name: 'Bagua',
          distritos: ['Bagua', 'Aramango', 'Copallin', 'El Parco', 'Imaza', 'La Peca']
        },
        bongara: {
          name: 'Bongará',
          distritos: ['Jumbilla', 'Chisquilla', 'Churuja', 'Corosha', 'Cuispes', 'Florida', 'Jazan', 'Recta', 'San Carlos', 'Shipasbamba', 'Valera', 'Yambrasbamba']
        }
      }
    },
    ancash: {
      name: 'Ancash',
      provincias: {
        huaraz: {
          name: 'Huaraz',
          distritos: ['Huaraz', 'Cochabamba', 'Colcabamba', 'Huanchay', 'Independencia', 'Jangas', 'La Libertad', 'Olleros', 'Pampas', 'Pariacoto', 'Pira', 'Tarica']
        },
        aija: {
          name: 'Aija',
          distritos: ['Aija', 'Coris', 'Huacllán', 'La Merced', 'Succha']
        },
        santa: {
          name: 'Santa',
          distritos: ['Chimbote', 'Cáceres del Perú', 'Coishco', 'Macate', 'Moro', 'Nepeña', 'Samanco', 'Santa', 'Nuevo Chimbote']
        },
        casma: {
          name: 'Casma',
          distritos: ['Casma', 'Buena Vista Alta', 'Comandante Noel', 'Yautan']
        }
      }
    },
    apurimac: {
      name: 'Apurímac',
      provincias: {
        abancay: {
          name: 'Abancay',
          distritos: ['Abancay', 'Chacoche', 'Circa', 'Curahuasi', 'Huanipaca', 'Lambrama', 'Pichirhua', 'San Pedro de Cachora', 'Tamburco']
        },
        andahuaylas: {
          name: 'Andahuaylas',
          distritos: ['Andahuaylas', 'Andarapa', 'Chiara', 'Huancarama', 'Huancaray', 'Huayana', 'Kishuará', 'Pacobamba', 'Pacucha', 'Pampachiri', 'Pomacocha', 'San Antonio de Cachi', 'San Jerónimo', 'San Miguel de Chaccrampa', 'Santa María de Chicmo', 'Talavera', 'Tumay Huaraca', 'Turpo', 'Kaquiabamba']
        }
      }
    },
    arequipa: {
      name: 'Arequipa',
      provincias: {
        arequipa: {
          name: 'Arequipa',
          distritos: ['Arequipa', 'Alto Selva Alegre', 'Cayma', 'Cerro Colorado', 'Characato', 'Chiguata', 'Jacobo Hunter', 'La Joya', 'Mariano Melgar', 'Miraflores', 'Mollebaya', 'Paucarpata', 'Pocsi', 'Polobaya', 'Quequeña', 'Sabandia', 'Sachaca', 'San Juan de Siguas', 'San Juan de Tarucani', 'Santa Isabel de Siguas', 'Santa Rita de Siguas', 'Socabaya', 'Tiabaya', 'Uchumayo', 'Vitor', 'Yanahuara', 'Yarabamba', 'Yura']
        },
        camana: {
          name: 'Camaná',
          distritos: ['Camaná', 'José María Quimper', 'Mariano Nicolás Valcárcel', 'Mariscal Cáceres', 'Nicolás de Piérola', 'Ocoña', 'Quilca', 'Samuel Pastor']
        },
        caraveli: {
          name: 'Caravelí',
          distritos: ['Caravelí', 'Acarí', 'Atico', 'Atiquipa', 'Bella Unión', 'Cahuacho', 'Chala', 'Chaparra', 'Huanuhuanu', 'Jaqui', 'Lomas', 'Quicacha', 'Yauca']
        }
      }
    },
    ayacucho: {
      name: 'Ayacucho',
      provincias: {
        huamanga: {
          name: 'Huamanga',
          distritos: ['Ayacucho', 'Acocro', 'Acos Vinchos', 'Carmen Alto', 'Chiara', 'Ocros', 'Pacaycasa', 'Quinua', 'San José de Ticllas', 'San Juan Bautista', 'Santiago de Pischa', 'Socos', 'Tambillo', 'Vinchos', 'Jesús Nazareno']
        },
        cangallo: {
          name: 'Cangallo',
          distritos: ['Cangallo', 'Chuschi', 'Los Morochucos', 'María Parado de Bellido', 'Paras', 'Totos']
        }
      }
    },
    cajamarca: {
      name: 'Cajamarca',
      provincias: {
        cajamarca: {
          name: 'Cajamarca',
          distritos: ['Cajamarca', 'Asunción', 'Chetilla', 'Cospan', 'Encañada', 'Jesús', 'Llacanora', 'Los Baños del Inca', 'Magdalena', 'Matara', 'Namora', 'San Juan']
        },
        celendin: {
          name: 'Celendín',
          distritos: ['Celendín', 'Chumuch', 'Cortegana', 'Huasmin', 'Jorge Chávez', 'José Gálvez', 'Miguel Iglesias', 'Oxamarca', 'Sorochuco', 'Sucre', 'Utco', 'La Libertad de Pallán']
        }
      }
    },
    callao: {
      name: 'Callao',
      provincias: {
        callao: {
          name: 'Callao',
          distritos: ['Callao', 'Bellavista', 'Carmen de la Legua Reynoso', 'La Perla', 'La Punta', 'Mi Perú', 'Ventanilla']
        }
      }
    },
    cusco: {
      name: 'Cusco',
      provincias: {
        cusco: {
          name: 'Cusco',
          distritos: ['Cusco', 'Ccorca', 'Poroy', 'San Jerónimo', 'San Sebastián', 'Santiago', 'Saylla', 'Wanchaq']
        },
        anta: {
          name: 'Anta',
          distritos: ['Anta', 'Ancahuasi', 'Cachimayo', 'Chinchaypujio', 'Huarocondo', 'Limatambo', 'Mollepata', 'Pucyura', 'Zurite']
        },
        calca: {
          name: 'Calca',
          distritos: ['Calca', 'Coya', 'Lamay', 'Lares', 'Pisac', 'San Salvador', 'Taray', 'Yanatile']
        },
        urubamba: {
          name: 'Urubamba',
          distritos: ['Urubamba', 'Chinchero', 'Huayllabamba', 'Machupicchu', 'Maras', 'Ollantaytambo', 'Yucay']
        }
      }
    },
    huancavelica: {
      name: 'Huancavelica',
      provincias: {
        huancavelica: {
          name: 'Huancavelica',
          distritos: ['Huancavelica', 'Acobambilla', 'Acoria', 'Conayca', 'Cuenca', 'Huachocolpa', 'Huayllahuara', 'Izcuchaca', 'Laria', 'Manta', 'Mariscal Cáceres', 'Moya', 'Nuevo Occoro', 'Palca', 'Pilchaca', 'Vilca', 'Yauli', 'Ascensión', 'Huando']
        }
      }
    },
    huanuco: {
      name: 'Huánuco',
      provincias: {
        huanuco: {
          name: 'Huánuco',
          distritos: ['Huánuco', 'Amarilis', 'Chinchao', 'Churubamba', 'Margos', 'Quisqui (Kichki)', 'San Francisco de Cayran', 'San Pedro de Chaulán', 'Santa María del Valle', 'Yarumayo', 'Pillco Marca']
        }
      }
    },
    ica: {
      name: 'Ica',
      provincias: {
        ica: {
          name: 'Ica',
          distritos: ['Ica', 'La Tinguiña', 'Los Aquijes', 'Ocucaje', 'Pachacutec', 'Parcona', 'Pueblo Nuevo', 'Salas', 'San José de los Molinos', 'San Juan Bautista', 'Santiago', 'Subtanjalla', 'Tate', 'Yauca del Rosario']
        },
        chincha: {
          name: 'Chincha',
          distritos: ['Chincha Alta', 'Alto Larán', 'Chavin', 'Chincha Baja', 'El Carmen', 'Grocio Prado', 'Pueblo Nuevo', 'San Juan de Yanac', 'San Pedro de Huacarpana', 'Sunampe', 'Tambo de Mora']
        },
        pisco: {
          name: 'Pisco',
          distritos: ['Pisco', 'Huancano', 'Humay', 'Independencia', 'Paracas', 'San Andrés', 'San Clemente', 'Túpac Amaru Inca']
        }
      }
    },
    junin: {
      name: 'Junín',
      provincias: {
        huancayo: {
          name: 'Huancayo',
          distritos: ['Huancayo', 'Carhuacallanga', 'Chacapampa', 'Chicche', 'Chilca', 'Chongos Alto', 'Chupuro', 'Colca', 'Cullhuas', 'El Tambo', 'Huacrapuquio', 'Hualhuas', 'Huancan', 'Huasicancha', 'Huayucachi', 'Ingenio', 'Pariahuanca', 'Pilcomayo', 'Pucará', 'Quichuay', 'Quilcas', 'San Agustín', 'San Jerónimo de Tunán', 'Saño', 'Sapallanga', 'Sicaya', 'Santo Domingo de Acobamba', 'Viques']
        }
      }
    },
    la_libertad: {
      name: 'La Libertad',
      provincias: {
        trujillo: {
          name: 'Trujillo',
          distritos: ['Trujillo', 'El Porvenir', 'Florencia de Mora', 'Huanchaco', 'La Esperanza', 'Laredo', 'Moche', 'Poroto', 'Salaverry', 'Simbal', 'Víctor Larco Herrera']
        },
        ascope: {
          name: 'Ascope',
          distritos: ['Ascope', 'Chicama', 'Chocope', 'Magdalena de Cao', 'Paijan', 'Rázuri', 'Santiago de Cao', 'Casa Grande']
        }
      }
    },
    lambayeque: {
      name: 'Lambayeque',
      provincias: {
        chiclayo: {
          name: 'Chiclayo',
          distritos: ['Chiclayo', 'Chongoyape', 'Eten', 'Eten Puerto', 'José Leonardo Ortiz', 'La Victoria', 'Lagunas', 'Monsefu', 'Nueva Arica', 'Oyotun', 'Picsi', 'Pimentel', 'Reque', 'Santa Rosa', 'Saña', 'Cayalti', 'Patapo', 'Pomalca', 'Pucala', 'Tuman']
        },
        lambayeque: {
          name: 'Lambayeque',
          distritos: ['Lambayeque', 'Chochope', 'Illimo', 'Jayanca', 'Mochumi', 'Morrope', 'Motupe', 'Olmos', 'Pacora', 'Salas', 'San José', 'Tucume']
        }
      }
    },
    lima: {
      name: 'Lima',
      provincias: {
        lima: {
          name: 'Lima',
          distritos: ['Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos', 'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacamac', 'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo', 'Lima']
        },
        huaral: {
          name: 'Huaral',
          distritos: ['Huaral', 'Atavillos Alto', 'Atavillos Bajo', 'Chancay', 'Ihuarí', 'Lampián', 'Pacaraos', 'San Miguel de Acos', 'Santa Cruz de Andamarca', 'Sumbilca', 'Veintisiete de Noviembre']
        },
        canta: {
          name: 'Canta',
          distritos: ['Canta', 'Arahuay', 'Huamantanga', 'Huaros', 'Lachaqui', 'San Buenaventura', 'Santa Rosa de Quives']
        }
      }
    },
    loreto: {
      name: 'Loreto',
      provincias: {
        maynas: {
          name: 'Maynas',
          distritos: ['Iquitos', 'Alto Nanay', 'Fernando Lores', 'Indiana', 'Las Amazonas', 'Mazan', 'Napo', 'Punchana', 'Torres Causana', 'Belén', 'San Juan Bautista']
        }
      }
    },
    madre_de_dios: {
      name: 'Madre de Dios',
      provincias: {
        tambopata: {
          name: 'Tambopata',
          distritos: ['Tambopata', 'Inambari', 'Las Piedras', 'Laberinto']
        }
      }
    },
    moquegua: {
      name: 'Moquegua',
      provincias: {
        mariscal_nieto: {
          name: 'Mariscal Nieto',
          distritos: ['Moquegua', 'Carumas', 'Cuchumbaya', 'Samegua', 'San Cristóbal', 'Torata']
        }
      }
    },
    pasco: {
      name: 'Pasco',
      provincias: {
        pasco: {
          name: 'Pasco',
          distritos: ['Chaupimarca', 'Huachon', 'Huariaca', 'Huayllay', 'Ninacaca', 'Pallanchacra', 'Paucartambo', 'San Francisco de Asís de Yarusyacan', 'Simon Bolívar', 'Ticlacayan', 'Tinyahuarco', 'Vicco', 'Yanacancha']
        }
      }
    },
    piura: {
      name: 'Piura',
      provincias: {
        piura: {
          name: 'Piura',
          distritos: ['Piura', 'Castilla', 'Catacaos', 'Cura Mori', 'El Tallán', 'La Arena', 'La Unión', 'Las Lomas', 'Tambo Grande', 'Veintiseis de Octubre']
        },
        sullana: {
          name: 'Sullana',
          distritos: ['Sullana', 'Bellavista', 'Ignacio Escudero', 'Lancones', 'Marcavelica', 'Miguel Checa', 'Querecotillo', 'Salitral']
        }
      }
    },
    puno: {
      name: 'Puno',
      provincias: {
        puno: {
          name: 'Puno',
          distritos: ['Puno', 'Acora', 'Amantani', 'Atuncolla', 'Capachica', 'Chucuito', 'Coata', 'Huata', 'Mañazo', 'Paucarcolla', 'Pichacani', 'Plateria', 'San Antonio', 'Tiquillaca', 'Vilque']
        }
      }
    },
    san_martin: {
      name: 'San Martín',
      provincias: {
        moyobamba: {
          name: 'Moyobamba',
          distritos: ['Moyobamba', 'Calzada', 'Habana', 'Jepelacio', 'Soritor', 'Yantalo']
        }
      }
    },
    tacna: {
      name: 'Tacna',
      provincias: {
        tacna: {
          name: 'Tacna',
          distritos: ['Tacna', 'Alto de la Alianza', 'Calana', 'Ciudad Nueva', 'Inclan', 'Pachia', 'Palca', 'Pocollay', 'Sama', 'Coronel Gregorio Albarracín Lanchipa']
        }
      }
    },
    tumbes: {
      name: 'Tumbes',
      provincias: {
        tumbes: {
          name: 'Tumbes',
          distritos: ['Tumbes', 'Corrales', 'La Cruz', 'Pampas de Hospital', 'San Jacinto', 'San Juan de la Virgen']
        }
      }
    },
    ucayali: {
    name: 'Ucayali',
    provincias: {
      coronel_portillo: {
        name: 'Coronel Portillo',
        distritos: ['Callería', 'Campo Verde', 'Iparía', 'Masisea', 'Yarinacocha', 'Nueva Requena']
      },
      atalaya: {
        name: 'Atalaya',
        distritos: ['Raimondi', 'Sepahua', 'Tahuanía', 'Yurúa']
      },
      padre_abad: {
        name: 'Padre Abad',
        distritos: ['Padre Abad', 'Irázola', 'Curimaná', 'Huipoca', 'Boquerón', 'Alexander von Humboldt', 'Neshuya']
      },
      purus: {
        name: 'Purús',
        distritos: ['Purús']
      }
    }
  }
};
  
  loginForm: FormGroup;
  registerForm: FormGroup;
  error: string | null = null;
  registerError: string | null = null;
  isAuthenticated = false;
  nombreUsuario = '';
  userRole = '';

  // Datos mock del carrito con 5 productos
  cartItems: CartItem[] = [
    {
      id: 1,
      nombre: 'iPad Apple 11 Chip A16 Wi-Fi',
      precio: 1649,
      precioOriginal: 1799,
      descuento: 8,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=iPad',
      color: 'Azul',
      selected: true
    },
    {
      id: 2,
      nombre: 'MacBook Pro 14" M3',
      precio: 2299,
      precioOriginal: 2499,
      descuento: 8,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=MacBook',
      color: 'Gris Espacial',
      selected: true
    },
    {
      id: 3,
      nombre: 'iPhone 15 Pro Max',
      precio: 4899,
      precioOriginal: 5299,
      descuento: 8,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=iPhone',
      color: 'Titanio Natural',
      selected: true
    },
    {
      id: 4,
      nombre: 'Apple Watch Series 9',
      precio: 1499,
      precioOriginal: 1699,
      descuento: 12,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=Watch',
      color: 'Rosa',
      selected: true
    },
    {
      id: 5,
      nombre: 'AirPods Pro 2da Generación',
      precio: 899,
      precioOriginal: 999,
      descuento: 10,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/120x120/f0f0f0/333?text=AirPods',
      color: 'Blanco',
      selected: true
    }
  ];
  
  // Nuevas propiedades para el carrito mejorado
  allSelected = false;
  totalWithWarranty = 0;
  
  // Propiedades para paginación
  currentPage = 1;
  itemsPerPage = 3;

  // Getters para calcular totales
  get subtotal(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }
  
  get igv(): number {
    return this.subtotal * 0.18;
  }
  
  get total(): number {
    return this.subtotal + this.igv;
  }

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
    
    this.registerForm = this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, CustomValidators.onlyLetters]],
      apellidos: ['', [Validators.required, CustomValidators.onlyLetters]],
      tipoDocumento: ['DNI', Validators.required],
      numeroDocumento: ['', [Validators.required, CustomValidators.dynamicDocumentValidator('DNI')]],
      celular: ['', [Validators.required, CustomValidators.peruPhone]],
      contrasena: ['', [Validators.required, CustomValidators.strongPassword]]
    });
    
    // Escuchar cambios en el tipo de documento
    this.registerForm.get('tipoDocumento')?.valueChanges.subscribe(tipo => {
      this.updateDocumentValidation(tipo);
    });
  }
  
  updateDocumentValidation(tipoDocumento: string) {
    const documentControl = this.registerForm.get('numeroDocumento');
    
    // Limpiar el campo
    documentControl?.setValue('');
    
    // Actualizar validadores
    documentControl?.setValidators([
      Validators.required,
      CustomValidators.dynamicDocumentValidator(tipoDocumento)
    ]);
    
    // Actualizar validación
    documentControl?.updateValueAndValidity();
  }

  ngOnInit() {
    this.checkAuthentication();
    this.updateCartCount();
    this.initializeCartState();
    // Inicializar provincias y distritos si ya hay un departamento seleccionado
    if (this.selectedDepartamento) {
      this.onDepartamentoChange();
    }
    if (this.selectedProvincia) {
      this.onProvinciaChange();
    }
  }

  checkAuthentication() {
    const usuario = localStorage.getItem('usuario');
    console.log('Usuario en localStorage:', usuario);
    
    if (usuario) {
      this.isAuthenticated = true;
      
      try {
        const usuarioObj = JSON.parse(usuario);
        this.nombreUsuario = usuarioObj.nombreCompleto || usuarioObj.nombreUsuario || usuarioObj.usuario || 'Usuario';
        this.userRole = usuarioObj.rol || '';
        console.log('Rol del usuario:', this.userRole);
      } catch (e) {
        this.nombreUsuario = usuario;
        this.userRole = '';
      }
    } else {
      this.isAuthenticated = false;
      this.nombreUsuario = '';
      this.userRole = '';
    }
  }

  cerrarSesion() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.nombreUsuario = '';
    this.userRole = '';
    this.router.navigate(['/']);
  }

  updateCartCount() {
    this.cartCount = this.cartItems.reduce((total, item) => total + item.cantidad, 0);
  }

  onSearchClick() {
    console.log('Buscar:', this.searchTerm);
  }

  onLoginClick() {
    this.showLoginModal = true;
  }

  onRegisterClick() {
    this.showRegisterModal = true;
  }

  onCartClick() {
    this.showCartModal = true;
  }

  onCategoryClick(category: string) {
    console.log('Category clicked:', category);
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.loginForm.reset();
    this.error = null;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
    this.registerForm.reset();
    this.registerError = null;
  }

  closeCartModal() {
    this.showCartModal = false;
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.closeLoginModal();
          this.checkAuthentication();
          this.router.navigate(['/']);
        },
        error: () => {
          this.error = 'Usuario o contraseña incorrectos';
        }
      });
    } else {
      this.error = 'Por favor, completa todos los campos';
    }
  }

  register() {
    if (this.registerForm.valid) {
      const userData = {
        correoElectronico: this.registerForm.value.correoElectronico,
        nombre: this.registerForm.value.nombre,
        apellidos: this.registerForm.value.apellidos,
        tipoDocumento: this.registerForm.value.tipoDocumento,
        numeroDocumento: this.registerForm.value.numeroDocumento,
        celular: this.registerForm.value.celular,
        contrasena: this.registerForm.value.contrasena
      };
      
      this.authService.registrar(userData).subscribe({
        next: (response) => {
          this.closeRegisterModal();
          this.showLoginModal = true;
        },
        error: (error) => {
          this.registerError = error.error?.message || 'Error al registrar usuario';
        }
      });
    } else {
      this.registerError = 'Por favor, completa todos los campos correctamente';
    }
  }

  // Métodos para el carrito
  incrementQty(item: CartItem) {
    if (item.cantidad < 10) {
      item.cantidad++;
      this.updateCartCount();
    }
  }

  decrementQty(item: CartItem) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.updateCartCount();
    }
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.updateCartCount();
  }

  emptyCart() {
    this.cartItems = [];
    this.updateCartCount();
  }

  // Métodos para redes sociales
  loginWithFacebook() {
    console.log('Login con Facebook');
  }

  loginWithGoogle() {
    console.log('Login con Google');
  }

  loginWithTwitter() {
    console.log('Login con Twitter');
  }

  loginWithApple() {
    console.log('Login con Apple');
  }

  forgotPassword() {
    console.log('Recuperar contraseña');
  }
  
  switchToLogin() {
    this.closeRegisterModal();
    this.showLoginModal = true;
  }

  switchToRegister() {
    this.closeLoginModal();
    this.showRegisterModal = true;
  }

  // Métodos para filtrar entrada de datos
  onNameInput(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    // Solo permitir letras, espacios y acentos
    value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    
    if (input.value !== value) {
      input.value = value;
      this.registerForm.get(field)?.setValue(value);
    }
  }

  onDNIInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;
    
    switch (tipoDocumento) {
      case 'DNI':
        // Solo permitir números, máximo 8 dígitos
        value = value.replace(/[^0-9]/g, '').slice(0, 8);
        // Si el primer dígito es 0, eliminarlo
        if (value.startsWith('0') && value.length > 1) {
          value = value.substring(1);
        }
        break;
        
      case 'CE':
        // Solo permitir números, máximo 9 dígitos, debe empezar con 0
        value = value.replace(/[^0-9]/g, '').slice(0, 9);
        // Si no empieza con 0, agregarlo
        if (value.length > 0 && !value.startsWith('0')) {
          value = '0' + value.substring(0, 8);
        }
        break;
        
      case 'PASSPORT':
        // Permitir letras y números, máximo 9 caracteres, convertir a mayúsculas
        value = value.replace(/[^A-Za-z0-9]/g, '').slice(0, 9).toUpperCase();
        break;
    }
    
    if (input.value !== value) {
      input.value = value;
      this.registerForm.get('numeroDocumento')?.setValue(value);
      
      // Forzar validación
      this.registerForm.get('numeroDocumento')?.markAsTouched();
      this.registerForm.get('numeroDocumento')?.updateValueAndValidity();
    }
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    // Solo permitir números, máximo 9 dígitos
    value = value.replace(/[^0-9]/g, '').slice(0, 9);
    
    // Si no empieza con 9, forzar que empiece con 9
    if (value.length > 0 && !value.startsWith('9')) {
      // Si escribió un número diferente a 9 como primer dígito, reemplazarlo por 9
      if (value.length === 1) {
        value = '9';
      } else {
        // Si ya había números, mantener solo los que están después del primer dígito
        value = '9' + value.substring(1);
      }
    }
    
    if (input.value !== value) {
      input.value = value;
      this.registerForm.get('celular')?.setValue(value);
      
      // Forzar validación
      this.registerForm.get('celular')?.markAsTouched();
      this.registerForm.get('celular')?.updateValueAndValidity();
    }
  }

  onKeyPress(event: KeyboardEvent, field: string) {
    const char = event.key;
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    
    // Permitir teclas de control
    if (this.isControlKey(event)) {
      return true;
    }
    
    switch (field) {
      case 'nombre':
      case 'apellidos':
        if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(char)) {
          event.preventDefault();
          return false;
        }
        break;
      case 'dni':
        const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;
        
        switch (tipoDocumento) {
          case 'DNI':
            if (!/[0-9]/.test(char)) {
              event.preventDefault();
              return false;
            }
            // No permitir 0 como primer dígito
            if (char === '0' && currentValue.length === 0) {
              event.preventDefault();
              return false;
            }
            break;
            
          case 'CE':
            if (!/[0-9]/.test(char)) {
              event.preventDefault();
              return false;
            }
            // Solo permitir 0 como primer dígito
            if (currentValue.length === 0 && char !== '0') {
              event.preventDefault();
              return false;
            }
            break;
            
          case 'PASSPORT':
            if (!/[a-zA-Z0-9]/.test(char)) {
              event.preventDefault();
              return false;
            }
            break;
        }
        break;
        
      case 'celular':
        if (!/[0-9]/.test(char)) {
          event.preventDefault();
          return false;
        }
        // Solo permitir 9 como primer dígito
        if (currentValue.length === 0 && char !== '9') {
          event.preventDefault();
          return false;
        }
        break;
    }
    return true;
  }
  
  private isControlKey(event: KeyboardEvent): boolean {
    return event.key === 'Backspace' || 
           event.key === 'Delete' || 
           event.key === 'Tab' || 
           event.key === 'Escape' || 
           event.key === 'Enter' || 
           event.key === 'Home' || 
           event.key === 'End' || 
           event.key === 'ArrowLeft' || 
           event.key === 'ArrowRight' || 
           event.key === 'ArrowUp' || 
           event.key === 'ArrowDown' ||
           (event.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(event.key));
  }

  // Métodos para obtener mensajes de error personalizados
  getNameError(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['onlyLetters']) return 'Solo se permiten letras';
    }
    return '';
  }

  getDNIError(): string {
    const control = this.registerForm.get('numeroDocumento');
    const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;
    
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      
      switch (tipoDocumento) {
        case 'DNI':
          if (control.errors['invalidDNI']) return 'DNI inválido: debe tener 8 dígitos, no empezar con 0 y ser un número válido';
          break;
        case 'CE':
          if (control.errors['invalidCarnet']) return 'Carnet inválido: debe tener 9 dígitos y empezar con 0';
          break;
        case 'PASSPORT':
          if (control.errors['invalidPassport']) return 'Pasaporte inválido: debe tener 9 caracteres alfanuméricos';
          break;
      }
    }
    return '';
  }

  getPhoneError(): string {
    const control = this.registerForm.get('celular');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['invalidPhone']) return 'Celular debe tener 9 dígitos y empezar con 9';
    }
    return '';
  }
  
  getPasswordError(): string {
    const control = this.registerForm.get('contrasena');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['minLength']) return 'Mínimo 8 caracteres';
      if (control.errors['missingUpperCase']) return 'Debe contener al menos una mayúscula';
      if (control.errors['missingNumber']) return 'Debe contener al menos un número';
      if (control.errors['missingSpecialChar']) return 'Debe contener al menos un carácter especial';
    }
    return '';
  }

  // Método para obtener placeholder dinámico
  getDocumentPlaceholder(): string {
    const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;
    switch (tipoDocumento) {
      case 'DNI':
        return '12345678';
      case 'CE':
        return '012345678';
      case 'PASSPORT':
        return 'ABC123456';
      default:
        return 'Ingresa documento';
    }
  }
  
  // Método para obtener maxlength dinámico
  getDocumentMaxLength(): number {
    const tipoDocumento = this.registerForm.get('tipoDocumento')?.value;
    switch (tipoDocumento) {
      case 'DNI':
        return 8;
      case 'CE':
      case 'PASSPORT':
        return 9;
      default:
        return 9;
    }
  }

  // Nuevos métodos para el carrito mejorado
  toggleSelectAll() {
    this.allSelected = !this.allSelected;
    // Aplicar selección a TODOS los items, no solo los visibles
    this.cartItems.forEach(item => {
      item.selected = this.allSelected;
    });
    this.updateTotals();
  }

  toggleItemSelection(item: CartItem) {
    item.selected = !item.selected;
    this.updateAllSelectedState();
    this.updateTotals();
  }

  updateAllSelectedState() {
    this.allSelected = this.cartItems.every(item => item.selected);
  }

  getSelectedItemsCount(): number {
    return this.cartItems.filter(item => item.selected).length;
  }

  getDiscountAmount(): number {
    return this.cartItems
      .filter(item => item.selected && item.precioOriginal)
      .reduce((total, item) => {
        const discount = (item.precioOriginal! - item.precio) * item.cantidad;
        return total + discount;
      }, 0);
  }

  updateTotals() {
    // Calcular total con garantía (precio ficticio para demostración)
    const selectedSubtotal = this.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.precio * item.cantidad), 0);
    
    // Asumiendo un costo de garantía de S/435 por producto seleccionado
    const warrantyBase = 435;
    const selectedItemsCount = this.getSelectedItemsCount();
    this.totalWithWarranty = selectedSubtotal + (warrantyBase * selectedItemsCount);
  }

  // Método para inicializar el estado del carrito
  initializeCartState() {
    // Asegurar que todos los items tengan la propiedad selected
    this.cartItems.forEach(item => {
      if (item.selected === undefined) {
        item.selected = true;
      }
    });
    
    // Resetear a la primera página
    this.currentPage = 1;
    
    this.updateAllSelectedState();
    this.updateTotals();
  }

  // Métodos de paginación
  getPaginatedItems(): CartItem[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.cartItems.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.cartItems.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Métodos para el modal de checkout
  proceedToCheckout(): void {
    this.closeCartModal();
    this.showCheckoutModal = true;
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal = false;
  }

  selectDeliveryType(type: string): void {
    this.selectedDeliveryType = type;
  }

  proceedToPayment(): void {
    console.log('Proceder al pago con tipo de entrega:', this.selectedDeliveryType);
    // Aquí iría la lógica para proceder al pago
  }

  // Métodos para el modal de dirección
  openAddressModal(): void {
    this.showAddressModal = true;
  }

  closeAddressModal(): void {
    this.showAddressModal = false;
    // Limpiar los campos del formulario
    this.selectedDepartamento = '';
    this.selectedProvincia = '';
    this.selectedDistrito = '';
    this.provincias = [];
    this.distritos = [];
  }

  confirmAddress(): void {
    // Construir la dirección completa
    const departamento = this.ubicacionesData[this.selectedDepartamento]?.name || '';
    const provincia = this.ubicacionesData[this.selectedDepartamento]?.provincias[this.selectedProvincia]?.name || '';
    const distritoObj = this.distritos.find(d => d.value === this.selectedDistrito);
    const distrito = distritoObj?.name || '';
    
    if (departamento && provincia && distrito && this.avenida && this.numero) {
      let direccionCompleta = `${this.avenida} ${this.numero}`;
      if (this.referencias) {
        direccionCompleta += `, ${this.referencias}`;
      }
      direccionCompleta += `, ${distrito}, ${provincia}, ${departamento}`;
      
      this.deliveryAddress = direccionCompleta;
      console.log('Dirección confirmada:', this.deliveryAddress);
      this.closeAddressModal();
    } else {
      alert('Por favor completa todos los campos obligatorios (Departamento, Provincia, Distrito, Avenida/Calle y Número)');
    }
  }

  // Método para manejar cambio de departamento
  onDepartamentoChange(): void {
    // Asegúrate de que selectedDepartamento es el value (key) del objeto
    // Ejemplo: 'amazonas', 'ancash', etc.
    this.selectedProvincia = '';
    this.selectedDistrito = '';
    this.provincias = [];
    this.distritos = [];

    if (this.selectedDepartamento && this.ubicacionesData[this.selectedDepartamento]) {
      const departamentoData = this.ubicacionesData[this.selectedDepartamento];
      this.provincias = Object.keys(departamentoData.provincias).map(key => ({
        value: key,
        name: departamentoData.provincias[key].name
      }));
    }
  }

  // Método para manejar cambio de provincia  
  onProvinciaChange(): void {
    console.log('Provincia seleccionada:', this.selectedProvincia);
    
    // Resetear distrito
    this.selectedDistrito = '';
    this.distritos = [];
    
    if (
      this.selectedDepartamento &&
      this.selectedProvincia &&
      this.ubicacionesData[this.selectedDepartamento] &&
      this.ubicacionesData[this.selectedDepartamento].provincias[this.selectedProvincia]
    ) {
      const provinciaData = this.ubicacionesData[this.selectedDepartamento].provincias[this.selectedProvincia];
      console.log('Datos de la provincia:', provinciaData);
      
      if (provinciaData && provinciaData.distritos) {
        this.distritos = provinciaData.distritos.map((distrito: string) => ({
          value: distrito.toLowerCase().replace(/\s+/g, '_').replace(/[áéíóúñ]/g, match => {
            const replacements: {[key: string]: string} = {'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n'};
            return replacements[match] || match;
          }),
          name: distrito
        }));
        console.log('Distritos cargados:', this.distritos);
      }
    }
  }

  // Método para obtener la lista de departamentos
  getDepartamentos(): {value: string, name: string}[] {
    const departamentos = Object.keys(this.ubicacionesData).map(key => ({
      value: key,
      name: this.ubicacionesData[key].name
    }));
    console.log('Departamentos disponibles:', departamentos);
    return departamentos;
  }

  get selectedDepartamentoName(): string {
    return this.ubicacionesData[this.selectedDepartamento]?.name || '';
  }
}

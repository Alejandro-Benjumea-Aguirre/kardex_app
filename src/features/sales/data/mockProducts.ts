export interface MockProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  unitPrice: number;
}

export const mockProducts: MockProduct[] = [
  { id: 1,  name: 'Laptop Dell XPS 15',    sku: 'LAP-001', category: 'Electrónica',     stock: 25, minStock: 10, unitPrice: 4500000 },
  { id: 2,  name: 'Monitor LG 27"',         sku: 'MON-002', category: 'Electrónica',     stock: 12, minStock:  5, unitPrice: 1200000 },
  { id: 3,  name: 'Teclado Mecánico',       sku: 'TEC-003', category: 'Electrónica',     stock: 38, minStock: 20, unitPrice:  220000 },
  { id: 4,  name: 'Mouse Inalámbrico',      sku: 'MOU-004', category: 'Electrónica',     stock:  4, minStock: 10, unitPrice:   95000 },
  { id: 5,  name: 'Webcam HD',              sku: 'WEB-005', category: 'Electrónica',     stock:  2, minStock:  8, unitPrice:  185000 },
  { id: 6,  name: 'Audífonos Bluetooth',    sku: 'AUD-006', category: 'Electrónica',     stock: 15, minStock:  5, unitPrice:  320000 },
  { id: 7,  name: 'Silla Ergonómica',       sku: 'SIL-007', category: 'Mobiliario',      stock:  8, minStock:  3, unitPrice:  850000 },
  { id: 8,  name: 'Escritorio de Pie',      sku: 'ESC-008', category: 'Mobiliario',      stock:  5, minStock:  2, unitPrice: 1100000 },
  { id: 9,  name: 'Impresora Láser',        sku: 'IMP-009', category: 'Electrónica',     stock:  6, minStock:  3, unitPrice:  680000 },
  { id: 10, name: 'Cable HDMI 2m',          sku: 'CAB-010', category: 'Accesorios',      stock: 50, minStock: 20, unitPrice:   28000 },
  { id: 11, name: 'Hub USB-C 7 en 1',       sku: 'HUB-011', category: 'Accesorios',      stock: 22, minStock: 10, unitPrice:  145000 },
  { id: 12, name: 'Disco Duro Externo 1TB', sku: 'DIS-012', category: 'Almacenamiento',  stock: 18, minStock:  8, unitPrice:  260000 },
];

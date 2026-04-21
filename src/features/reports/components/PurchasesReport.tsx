import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils'

Chart.register(...registerables)

const purchases = [
  { id: 'OC-001', date: '2025-03-01', supplier: 'Distribuciones Tech',  product: 'Laptop Dell XPS 15', qty: 20, total: 64000000, status: 'Recibido'  },
  { id: 'OC-002', date: '2025-03-04', supplier: 'Electrónica Global',   product: 'Monitor LG 27"',     qty: 15, total: 14250000, status: 'Recibido'  },
  { id: 'OC-003', date: '2025-03-07', supplier: 'Periféricos S.A.',     product: 'Teclado Mecánico',   qty: 50, total:  9000000, status: 'Recibido'  },
  { id: 'OC-004', date: '2025-03-10', supplier: 'Distribuciones Tech',  product: 'Webcam HD',          qty: 10, total:  1200000, status: 'Pendiente' },
  { id: 'OC-005', date: '2025-03-12', supplier: 'Periféricos S.A.',     product: 'Mouse Inalámbrico',  qty: 30, total:  2250000, status: 'En tránsito'},
  { id: 'OC-006', date: '2025-03-15', supplier: 'Electrónica Global',   product: 'Laptop Dell XPS 15', qty: 10, total: 32000000, status: 'Pendiente' },
]

const bySupplier = [
  { supplier: 'Distribuciones Tech', orders: 2, total: 96000000 },
  { supplier: 'Electrónica Global',  orders: 2, total: 46250000 },
  { supplier: 'Periféricos S.A.',    orders: 2, total: 11250000 },
]

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

export default function PurchasesReport() {
  const chartRef  = useRef<HTMLCanvasElement>(null)
  const chartInst = useRef<Chart | null>(null)
  const [filter, setFilter]   = useState('')
  const [status, setStatus]   = useState('Todos')

  useEffect(() => {
    if (!chartRef.current) return
    chartInst.current?.destroy()
    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: bySupplier.map(s => s.supplier),
        datasets: [{
          label: 'Total Compras',
          data: bySupplier.map(s => s.total),
          backgroundColor: ['rgba(0,201,167,0.7)', 'rgba(78,205,196,0.7)', 'rgba(139,168,200,0.7)'],
          borderColor: ['#00c9a7', '#4ecdc4', '#8ba8c8'],
          borderWidth: 2,
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => formatCurrency(ctx.raw as number) } } },
        scales: {
          x: { ticks: { color: '#8ba8c8', font: { family: 'Nunito' }, callback: v => `$${(+v/1000000).toFixed(0)}M` }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#8ba8c8', font: { family: 'Nunito' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
      },
    })
    return () => chartInst.current?.destroy()
  }, [])

  const filtered = purchases.filter(p => {
    const matchText = p.supplier.toLowerCase().includes(filter.toLowerCase()) || p.product.toLowerCase().includes(filter.toLowerCase())
    const matchStatus = status === 'Todos' || p.status === status
    return matchText && matchStatus
  })

  const pending = purchases.filter(p => p.status === 'Pendiente' || p.status === 'En tránsito')

  return (
    <div className="report-section">
      <div className="kpi-grid">
        <div className="kpi-card kpi-card--accent">
          <span className="kpi-label">Total Compras</span>
          <span className="kpi-value kpi-value--sm">{formatCurrency(purchases.reduce((a, p) => a + p.total, 0))}</span>
          <span className="kpi-sub">este mes</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Órdenes</span>
          <span className="kpi-value">{purchases.length}</span>
          <span className="kpi-sub">generadas</span>
        </div>
        <div className="kpi-card kpi-card--warning">
          <span className="kpi-label">Pendientes</span>
          <span className="kpi-value">{pending.length}</span>
          <span className="kpi-sub">por recibir</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Proveedores</span>
          <span className="kpi-value">{bySupplier.length}</span>
          <span className="kpi-sub">activos</span>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">Compras por Proveedor</h3>
        </div>
        <div className="chart-wrapper"><canvas ref={chartRef} /></div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="table-card-title">Órdenes de Compra</h3>
          <div className="toolbar-filters">
            <input className="filter-input" placeholder="🔍  Buscar proveedor o producto..." value={filter} onChange={e => setFilter(e.target.value)} />
            <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
              <option>Todos</option>
              <option>Recibido</option>
              <option>Pendiente</option>
              <option>En tránsito</option>
            </select>
          </div>
          <div className="toolbar-actions">
            <button className="btn-export btn-export--excel" onClick={() => exportToExcel(filtered, 'ordenes_compra')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Excel
            </button>
            <button className="btn-export btn-export--pdf" onClick={() => exportToPDF('Órdenes de Compra', filtered.map(r => [r.id, r.date, r.supplier, r.product, r.qty, formatCurrency(r.total), r.status]), ['OC','Fecha','Proveedor','Producto','Cant.','Total','Estado'])}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>PDF
            </button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>N° OC</th><th>Fecha</th><th>Proveedor</th><th>Producto</th><th>Cant.</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className="td-mono">{row.id}</td>
                  <td>{row.date}</td>
                  <td className="td-product">{row.supplier}</td>
                  <td>{row.product}</td>
                  <td>{row.qty}</td>
                  <td className="td-accent">{formatCurrency(row.total)}</td>
                  <td>
                    <span className={`badge badge--${row.status === 'Recibido' ? 'success' : row.status === 'Pendiente' ? 'warning' : 'info'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

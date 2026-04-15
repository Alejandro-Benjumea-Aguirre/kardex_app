import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { exportToExcel, exportToPDF } from '../../utils/exportUtils'

Chart.register(...registerables)

const monthlySales = [
  { month: 'Oct', total: 42000000 }, { month: 'Nov', total: 58000000 },
  { month: 'Dic', total: 71000000 }, { month: 'Ene', total: 38000000 },
  { month: 'Feb', total: 53000000 }, { month: 'Mar', total: 64000000 },
]

const salesByClient = [
  { client: 'TechCorp S.A.S',     total: 28500000, orders: 8,  lastDate: '2025-03-14' },
  { client: 'Inversiones López',  total: 19200000, orders: 5,  lastDate: '2025-03-12' },
  { client: 'Comercial Andina',   total: 14700000, orders: 4,  lastDate: '2025-03-10' },
  { client: 'Digital Solutions',  total: 9800000,  orders: 3,  lastDate: '2025-03-08' },
  { client: 'Grupo Empresarial',  total: 7600000,  orders: 2,  lastDate: '2025-03-05' },
]

const topProducts = [
  { product: 'Laptop Dell XPS 15', qty: 12, total: 38400000 },
  { product: 'Monitor LG 27"',     qty:  8, total:  7600000 },
  { product: 'Teclado Mecánico',   qty: 25, total:  4500000 },
  { product: 'Mouse Inalámbrico',  qty: 18, total:  1350000 },
]

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

export default function SalesReport() {
  const lineRef   = useRef<HTMLCanvasElement>(null)
  const pieRef    = useRef<HTMLCanvasElement>(null)
  const lineInst  = useRef<Chart | null>(null)
  const pieInst   = useRef<Chart | null>(null)
  const [period, setPeriod] = useState('mensual')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!lineRef.current) return
    lineInst.current?.destroy()
    lineInst.current = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: monthlySales.map(m => m.month),
        datasets: [{
          label: 'Ventas (COP)',
          data: monthlySales.map(m => m.total),
          borderColor: '#00c9a7',
          backgroundColor: 'rgba(0,201,167,0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#00c9a7',
          pointBorderColor: '#1e2a3a',
          pointRadius: 6,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8ba8c8', font: { family: 'Nunito' } } },
          tooltip: { callbacks: { label: ctx => formatCurrency(ctx.raw as number) } },
        },
        scales: {
          x: { ticks: { color: '#8ba8c8', font: { family: 'Nunito' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#8ba8c8', font: { family: 'Nunito' }, callback: v => `$${(+v/1000000).toFixed(0)}M` }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
      },
    })
    return () => lineInst.current?.destroy()
  }, [period])

  useEffect(() => {
    if (!pieRef.current) return
    pieInst.current?.destroy()
    pieInst.current = new Chart(pieRef.current, {
      type: 'doughnut',
      data: {
        labels: topProducts.map(p => p.product),
        datasets: [{
          data: topProducts.map(p => p.total),
          backgroundColor: ['#00c9a7','#4ecdc4','#8ba8c8','#6e8fab'],
          borderColor: '#1a2535',
          borderWidth: 3,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#8ba8c8', font: { family: 'Nunito' }, padding: 15 } },
          tooltip: { callbacks: { label: ctx => `${ctx.label}: ${formatCurrency(ctx.raw as number)}` } },
        },
      },
    })
    return () => pieInst.current?.destroy()
  }, [])

  const filteredClients = salesByClient.filter(c =>
    c.client.toLowerCase().includes(filter.toLowerCase())
  )

  const totalMonth  = monthlySales[monthlySales.length - 1].total
  const totalOrders = salesByClient.reduce((a, c) => a + c.orders, 0)
  const avgTicket   = Math.round(salesByClient.reduce((a, c) => a + c.total, 0) / totalOrders)

  return (
    <div className="report-section">
      <div className="kpi-grid">
        <div className="kpi-card kpi-card--accent">
          <span className="kpi-label">Ventas este Mes</span>
          <span className="kpi-value kpi-value--sm">{formatCurrency(totalMonth)}</span>
          <span className="kpi-sub kpi-sub--up">▲ 20.7% vs mes anterior</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Órdenes Totales</span>
          <span className="kpi-value">{totalOrders}</span>
          <span className="kpi-sub">en el período</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Ticket Promedio</span>
          <span className="kpi-value kpi-value--sm">{formatCurrency(avgTicket)}</span>
          <span className="kpi-sub">por orden</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Clientes Activos</span>
          <span className="kpi-value">{salesByClient.length}</span>
          <span className="kpi-sub">con compras</span>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card chart-card--wide">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Tendencia de Ventas</h3>
            <div className="chart-controls">
              {['mensual', 'trimestral'].map(p => (
                <button key={p} className={`btn-period ${period === p ? 'btn-period--active' : ''}`} onClick={() => setPeriod(p)}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-wrapper"><canvas ref={lineRef} /></div>
        </div>
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Top Productos</h3>
          </div>
          <div className="chart-wrapper"><canvas ref={pieRef} /></div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="table-card-title">Ventas por Cliente</h3>
          <div className="toolbar-filters">
            <input className="filter-input" placeholder="🔍  Buscar cliente..." value={filter} onChange={e => setFilter(e.target.value)} />
          </div>
          <div className="toolbar-actions">
            <button className="btn-export btn-export--excel" onClick={() => exportToExcel(filteredClients, 'ventas_clientes')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Excel
            </button>
            <button className="btn-export btn-export--pdf" onClick={() => exportToPDF('Ventas por Cliente', filteredClients.map(r => [r.client, r.orders, formatCurrency(r.total), r.lastDate]), ['Cliente','Órdenes','Total Ventas','Última Compra'])}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>PDF
            </button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Cliente</th><th>Órdenes</th><th>Total Ventas</th><th>Última Compra</th></tr></thead>
            <tbody>
              {filteredClients.map((row, i) => (
                <tr key={i}>
                  <td className="td-product">{row.client}</td>
                  <td>{row.orders}</td>
                  <td className="td-accent">{formatCurrency(row.total)}</td>
                  <td>{row.lastDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

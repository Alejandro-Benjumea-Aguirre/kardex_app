import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { exportToExcel, exportToPDF } from '../../utils/exportUtils'

Chart.register(...registerables)

const mockMovements = [
  { id: 1, date: '2025-03-01', product: 'Laptop Dell XPS 15', type: 'Entrada', qty: 20, balance: 20, unitCost: 3200000, warehouse: 'Bodega Principal' },
  { id: 2, date: '2025-03-03', product: 'Monitor LG 27"',     type: 'Entrada', qty: 15, balance: 15, unitCost:  950000, warehouse: 'Bodega Principal' },
  { id: 3, date: '2025-03-05', product: 'Laptop Dell XPS 15', type: 'Salida',  qty:  5, balance: 15, unitCost: 3200000, warehouse: 'Bodega Principal' },
  { id: 4, date: '2025-03-07', product: 'Teclado Mecánico',   type: 'Entrada', qty: 50, balance: 50, unitCost:  180000, warehouse: 'Bodega Sur'       },
  { id: 5, date: '2025-03-10', product: 'Monitor LG 27"',     type: 'Salida',  qty:  3, balance: 12, unitCost:  950000, warehouse: 'Bodega Principal' },
  { id: 6, date: '2025-03-12', product: 'Mouse Inalámbrico',  type: 'Entrada', qty: 30, balance: 30, unitCost:   75000, warehouse: 'Bodega Sur'       },
  { id: 7, date: '2025-03-14', product: 'Teclado Mecánico',   type: 'Salida',  qty: 12, balance: 38, unitCost:  180000, warehouse: 'Bodega Sur'       },
  { id: 8, date: '2025-03-15', product: 'Laptop Dell XPS 15', type: 'Entrada', qty: 10, balance: 25, unitCost: 3200000, warehouse: 'Bodega Principal' },
]

const stockData = [
  { product: 'Laptop Dell XPS 15', stock: 25, min: 10, warehouse: 'Bodega Principal', value: 80000000 },
  { product: 'Monitor LG 27"',     stock: 12, min: 5,  warehouse: 'Bodega Principal', value: 11400000 },
  { product: 'Teclado Mecánico',   stock: 38, min: 20, warehouse: 'Bodega Sur',        value:  6840000 },
  { product: 'Mouse Inalámbrico',  stock:  4, min: 10, warehouse: 'Bodega Sur',        value:   300000 },
  { product: 'Webcam HD',          stock:  2, min:  8, warehouse: 'Bodega Principal',  value:   240000 },
]

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

export default function InventoryReport() {
  const chartRef    = useRef<HTMLCanvasElement>(null)
  const chartInst   = useRef<Chart | null>(null)
  const [filter, setFilter]     = useState('')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [activeSubTab, setActiveSubTab] = useState<'movements' | 'stock' | 'low'>('movements')

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInst.current) chartInst.current.destroy()

    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['Laptop Dell', 'Monitor LG', 'Teclado Mec.', 'Mouse Inal.', 'Webcam HD'],
        datasets: [
          {
            label: 'Stock Actual',
            data: [25, 12, 38, 4, 2],
            backgroundColor: 'rgba(0,201,167,0.7)',
            borderColor: '#00c9a7',
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: 'Stock Mínimo',
            data: [10, 5, 20, 10, 8],
            backgroundColor: 'rgba(139,168,200,0.3)',
            borderColor: '#8ba8c8',
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8ba8c8', font: { family: 'Nunito', size: 12 } } },
        },
        scales: {
          x: { ticks: { color: '#8ba8c8', font: { family: 'Nunito' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#8ba8c8', font: { family: 'Nunito' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
      },
    })
    return () => { chartInst.current?.destroy() }
  }, [])

  const filtered = mockMovements.filter(m => {
    const matchText = m.product.toLowerCase().includes(filter.toLowerCase())
    const matchType = typeFilter === 'Todos' || m.type === typeFilter
    return matchText && matchType
  })

  const lowStock = stockData.filter(s => s.stock < s.min)

  return (
    <div className="report-section">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Productos</span>
          <span className="kpi-value">5</span>
          <span className="kpi-sub">en 2 bodegas</span>
        </div>
        <div className="kpi-card kpi-card--accent">
          <span className="kpi-label">Valor Inventario</span>
          <span className="kpi-value kpi-value--sm">{formatCurrency(98780000)}</span>
          <span className="kpi-sub">valorización total</span>
        </div>
        <div className="kpi-card kpi-card--warning">
          <span className="kpi-label">Stock Bajo</span>
          <span className="kpi-value">{lowStock.length}</span>
          <span className="kpi-sub">productos bajo mínimo</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Movimientos</span>
          <span className="kpi-value">{mockMovements.length}</span>
          <span className="kpi-sub">este mes</span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">Stock Actual vs Mínimo por Producto</h3>
        </div>
        <div className="chart-wrapper">
          <canvas ref={chartRef} />
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="subtabs">
        {(['movements', 'stock', 'low'] as const).map(t => (
          <button
            key={t}
            className={`subtab ${activeSubTab === t ? 'subtab--active' : ''}`}
            onClick={() => setActiveSubTab(t)}
          >
            {t === 'movements' ? 'Movimientos' : t === 'stock' ? 'Stock Actual' : `⚠️ Stock Bajo (${lowStock.length})`}
          </button>
        ))}
      </div>

      {activeSubTab === 'movements' && (
        <div className="table-card">
          <div className="table-toolbar">
            <div className="toolbar-filters">
              <input
                className="filter-input"
                placeholder="🔍  Buscar producto..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option>Todos</option>
                <option>Entrada</option>
                <option>Salida</option>
              </select>
            </div>
            <div className="toolbar-actions">
              <button className="btn-export btn-export--excel" onClick={() => exportToExcel(filtered, 'movimientos_inventario')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Excel
              </button>
              <button className="btn-export btn-export--pdf" onClick={() => exportToPDF('Movimientos de Inventario', filtered.map(r => [r.date, r.product, r.type, r.qty, r.balance, formatCurrency(r.unitCost)]), ['Fecha','Producto','Tipo','Cantidad','Saldo','Costo Unit.'])}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                PDF
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th><th>Producto</th><th>Tipo</th>
                  <th>Cantidad</th><th>Saldo</th><th>Costo Unit.</th><th>Bodega</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td className="td-product">{row.product}</td>
                    <td><span className={`badge badge--${row.type === 'Entrada' ? 'success' : 'danger'}`}>{row.type}</span></td>
                    <td>{row.qty}</td>
                    <td>{row.balance}</td>
                    <td>{formatCurrency(row.unitCost)}</td>
                    <td>{row.warehouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'stock' && (
        <div className="table-card">
          <div className="table-toolbar">
            <div className="toolbar-actions" style={{ marginLeft: 'auto' }}>
              <button className="btn-export btn-export--excel" onClick={() => exportToExcel(stockData, 'stock_actual')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Excel
              </button>
              <button className="btn-export btn-export--pdf" onClick={() => exportToPDF('Stock Actual', stockData.map(r => [r.product, r.stock, r.min, r.warehouse, formatCurrency(r.value)]), ['Producto','Stock','Mínimo','Bodega','Valorización'])}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>PDF
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Producto</th><th>Stock</th><th>Mínimo</th><th>Bodega</th><th>Valorización</th><th>Estado</th></tr></thead>
              <tbody>
                {stockData.map((row, i) => (
                  <tr key={i}>
                    <td className="td-product">{row.product}</td>
                    <td>{row.stock}</td>
                    <td>{row.min}</td>
                    <td>{row.warehouse}</td>
                    <td>{formatCurrency(row.value)}</td>
                    <td><span className={`badge badge--${row.stock >= row.min ? 'success' : 'warning'}`}>{row.stock >= row.min ? 'Normal' : 'Bajo'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'low' && (
        <div className="table-card">
          {lowStock.length === 0 ? (
            <div className="empty-state">✅ Todos los productos están sobre el stock mínimo</div>
          ) : (
            <>
              <div className="alert-banner">
                ⚠️ <strong>{lowStock.length} productos</strong> están por debajo del stock mínimo requerido. Se recomienda generar órdenes de compra.
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Producto</th><th>Stock Actual</th><th>Stock Mínimo</th><th>Diferencia</th><th>Bodega</th></tr></thead>
                  <tbody>
                    {lowStock.map((row, i) => (
                      <tr key={i} className="tr-warning">
                        <td className="td-product">{row.product}</td>
                        <td className="td-danger">{row.stock}</td>
                        <td>{row.min}</td>
                        <td className="td-danger">-{row.min - row.stock}</td>
                        <td>{row.warehouse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

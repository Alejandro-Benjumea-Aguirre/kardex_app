import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { exportToExcel, exportToPDF } from '../../utils/exportUtils'

Chart.register(...registerables)

const receivable = [
  { client: 'TechCorp S.A.S',    invoice: 'FAC-0021', date: '2025-02-15', due: '2025-03-15', total: 12000000, paid: 6000000, status: 'Parcial'  },
  { client: 'Inversiones López', invoice: 'FAC-0025', date: '2025-02-28', due: '2025-03-28', total:  8500000, paid: 0,       status: 'Pendiente' },
  { client: 'Comercial Andina',  invoice: 'FAC-0018', date: '2025-02-10', due: '2025-03-10', total:  4700000, paid: 4700000, status: 'Pagado'    },
  { client: 'Digital Solutions', invoice: 'FAC-0029', date: '2025-03-05', due: '2025-04-05', total:  9800000, paid: 0,       status: 'Pendiente' },
]

const payable = [
  { supplier: 'Distribuciones Tech', invoice: 'FP-0087', date: '2025-03-01', due: '2025-03-31', total: 32000000, paid: 32000000, status: 'Pagado'    },
  { supplier: 'Electrónica Global',  invoice: 'FP-0091', date: '2025-03-12', due: '2025-04-12', total: 14250000, paid: 0,        status: 'Pendiente' },
  { supplier: 'Periféricos S.A.',    invoice: 'FP-0093', date: '2025-03-15', due: '2025-04-15', total:  2250000, paid: 0,        status: 'Pendiente' },
]

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

export default function ClientsReport() {
  const chartRef  = useRef<HTMLCanvasElement>(null)
  const chartInst = useRef<Chart | null>(null)
  const [subTab, setSubTab]   = useState<'receivable' | 'payable'>('receivable')
  const [filter, setFilter]   = useState('')

  useEffect(() => {
    if (!chartRef.current) return
    chartInst.current?.destroy()
    const isRec = subTab === 'receivable'
    const data  = isRec ? receivable : payable
    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: data.map(d => isRec ? (d as typeof receivable[0]).client : (d as typeof payable[0]).supplier),
        datasets: [
          {
            label: 'Total',
            data: data.map(d => d.total),
            backgroundColor: 'rgba(0,201,167,0.4)',
            borderColor: '#00c9a7',
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: 'Pendiente',
            data: data.map(d => d.total - d.paid),
            backgroundColor: 'rgba(255,107,107,0.5)',
            borderColor: '#ff6b6b',
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8ba8c8', font: { family: 'Nunito' } } },
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatCurrency(ctx.raw as number)}` } },
        },
        scales: {
          x: { ticks: { color: '#8ba8c8', font: { family: 'Nunito' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#8ba8c8', font: { family: 'Nunito' }, callback: v => `$${(+v/1000000).toFixed(0)}M` }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
      },
    })
    return () => chartInst.current?.destroy()
  }, [subTab])

  const totalRec     = receivable.reduce((a, r) => a + r.total, 0)
  const pendingRec   = receivable.reduce((a, r) => a + (r.total - r.paid), 0)
  const totalPay     = payable.reduce((a, p) => a + p.total, 0)
  const pendingPay   = payable.reduce((a, p) => a + (p.total - p.paid), 0)

  const filteredRec = receivable.filter(r => r.client.toLowerCase().includes(filter.toLowerCase()))
  const filteredPay = payable.filter(p => p.supplier.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="report-section">
      <div className="kpi-grid">
        <div className="kpi-card kpi-card--accent">
          <span className="kpi-label">Por Cobrar</span>
          <span className="kpi-value kpi-value--sm">{formatCurrency(pendingRec)}</span>
          <span className="kpi-sub">cartera pendiente</span>
        </div>
        <div className="kpi-card kpi-card--danger">
          <span className="kpi-label">Por Pagar</span>
          <span className="kpi-value kpi-value--sm">{formatCurrency(pendingPay)}</span>
          <span className="kpi-sub">a proveedores</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Clientes</span>
          <span className="kpi-value">{receivable.length}</span>
          <span className="kpi-sub">con facturas activas</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Proveedores</span>
          <span className="kpi-value">{payable.length}</span>
          <span className="kpi-sub">con saldo pendiente</span>
        </div>
      </div>

      <div className="subtabs">
        <button className={`subtab ${subTab === 'receivable' ? 'subtab--active' : ''}`} onClick={() => { setSubTab('receivable'); setFilter('') }}>
          Cuentas por Cobrar — {formatCurrency(pendingRec)}
        </button>
        <button className={`subtab ${subTab === 'payable' ? 'subtab--active' : ''}`} onClick={() => { setSubTab('payable'); setFilter('') }}>
          Cuentas por Pagar — {formatCurrency(pendingPay)}
        </button>
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">
            {subTab === 'receivable' ? 'Cartera de Clientes' : 'Obligaciones con Proveedores'}
          </h3>
        </div>
        <div className="chart-wrapper"><canvas ref={chartRef} /></div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="toolbar-filters">
            <input
              className="filter-input"
              placeholder={`🔍  Buscar ${subTab === 'receivable' ? 'cliente' : 'proveedor'}...`}
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <button className="btn-export btn-export--excel"
              onClick={() => exportToExcel(subTab === 'receivable' ? filteredRec : filteredPay, subTab === 'receivable' ? 'cuentas_cobrar' : 'cuentas_pagar')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Excel
            </button>
            <button className="btn-export btn-export--pdf"
              onClick={() => {
                if (subTab === 'receivable') {
                  exportToPDF('Cuentas por Cobrar', filteredRec.map(r => [r.client, r.invoice, r.date, r.due, formatCurrency(r.total), formatCurrency(r.total - r.paid), r.status]), ['Cliente','Factura','Fecha','Vence','Total','Pendiente','Estado'])
                } else {
                  exportToPDF('Cuentas por Pagar', filteredPay.map(r => [r.supplier, r.invoice, r.date, r.due, formatCurrency(r.total), formatCurrency(r.total - r.paid), r.status]), ['Proveedor','Factura','Fecha','Vence','Total','Pendiente','Estado'])
                }
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>PDF
            </button>
          </div>
        </div>
        <div className="table-wrapper">
          {subTab === 'receivable' ? (
            <table className="data-table">
              <thead><tr><th>Cliente</th><th>Factura</th><th>Emisión</th><th>Vencimiento</th><th>Total</th><th>Pendiente</th><th>Estado</th></tr></thead>
              <tbody>
                {filteredRec.map((row, i) => (
                  <tr key={i}>
                    <td className="td-product">{row.client}</td>
                    <td className="td-mono">{row.invoice}</td>
                    <td>{row.date}</td>
                    <td>{row.due}</td>
                    <td>{formatCurrency(row.total)}</td>
                    <td className={row.total - row.paid > 0 ? 'td-danger' : 'td-accent'}>{formatCurrency(row.total - row.paid)}</td>
                    <td><span className={`badge badge--${row.status === 'Pagado' ? 'success' : row.status === 'Parcial' ? 'info' : 'warning'}`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="data-table">
              <thead><tr><th>Proveedor</th><th>Factura</th><th>Emisión</th><th>Vencimiento</th><th>Total</th><th>Pendiente</th><th>Estado</th></tr></thead>
              <tbody>
                {filteredPay.map((row, i) => (
                  <tr key={i}>
                    <td className="td-product">{row.supplier}</td>
                    <td className="td-mono">{row.invoice}</td>
                    <td>{row.date}</td>
                    <td>{row.due}</td>
                    <td>{formatCurrency(row.total)}</td>
                    <td className={row.total - row.paid > 0 ? 'td-danger' : 'td-accent'}>{formatCurrency(row.total - row.paid)}</td>
                    <td><span className={`badge badge--${row.status === 'Pagado' ? 'success' : 'warning'}`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

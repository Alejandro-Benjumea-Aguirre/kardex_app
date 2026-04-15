// utils/exportUtils.ts
// Dependencias: npm install xlsx jspdf jspdf-autotable

// ──────────────────────────────────────────────────────────
// EXCEL  (SheetJS / xlsx)
// ──────────────────────────────────────────────────────────
export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  import('xlsx').then(XLSX => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`)
  })
}

// ──────────────────────────────────────────────────────────
// PDF  (jsPDF + autoTable)
// ──────────────────────────────────────────────────────────
export async function exportToPDF(
  title: string,
  rows: (string | number)[][],
  columns: string[],
) {
  const { default: jsPDF }   = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape' })

  // Header
  doc.setFillColor(26, 37, 53)       // #1a2535
  doc.rect(0, 0, 297, 25, 'F')
  doc.setTextColor(0, 201, 167)      // #00c9a7
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Kardex CO', 14, 16)
  doc.setTextColor(139, 168, 200)    // #8ba8c8
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(title, 70, 16)
  doc.setFontSize(9)
  doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, 220, 16)

  autoTable(doc, {
    startY: 30,
    head: [columns],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 201, 167],
      textColor: [26, 37, 53],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fillColor: [26, 37, 53],
      textColor: [200, 215, 230],
      fontSize: 8,
      lineColor: [40, 56, 78],
    },
    alternateRowStyles: {
      fillColor: [30, 42, 58],
    },
    styles: { cellPadding: 4 },
  })

  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`)
}
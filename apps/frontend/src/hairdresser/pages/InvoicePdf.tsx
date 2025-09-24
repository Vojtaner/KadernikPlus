import { Page, Text, Document, StyleSheet, pdf } from '@react-pdf/renderer'
import type { Invoice } from '../entity'
import saveAs from 'file-saver'

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 20, marginBottom: 20 },
})

const InvoicePdf = (props: { invoice: Invoice }) => {
  const { invoice } = props

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Fakura {invoice.invoiceNumber}</Text>
        <Text>Zákazník: {invoice.customerName}</Text>
        <Text>E-mail: {invoice.customerEmail}</Text>
        <Text>
          Cena: {invoice.amount} {invoice.currency}
        </Text>
        <Text>Stav: {invoice.status === 'PAID' ? 'Zaplaceno' : 'Nezaplaceno'}</Text>
        <Text>Vystaveno: {new Date(invoice.issuedAt).toLocaleDateString()}</Text>
        {invoice.notes && <Text>Poznámka: {invoice.notes}</Text>}
      </Page>
    </Document>
  )
}

export async function downloadInvoice(invoice: Invoice) {
  const blob = await pdf(<InvoicePdf invoice={invoice} />).toBlob()
  saveAs(blob, `${invoice.invoiceNumber}.pdf`)
}

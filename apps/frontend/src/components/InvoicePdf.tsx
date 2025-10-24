import { Page, Text, Document, StyleSheet, pdf, View, Image, Font } from '@react-pdf/renderer';
import type { Invoice } from '../hairdresser/entity';
import saveAs from 'file-saver';
import { useIntl } from 'react-intl';

Font.register({
  family: 'Roboto',
  src: '/assets/fonts/Roboto-Regular.ttf',
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c81f5b',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginTop: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#c81f5b',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '50%',
    backgroundColor: '#c81f5b',
    padding: 5,
  },
  tableCol: {
    width: '50%',
    padding: 5,
  },
  tableCellHeader: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableCell: {
    color: '#000',
  },
  text: { fontFamily: 'Roboto', fontSize: 14 },
});

const InvoicePdf = ({ invoice }: { invoice: Invoice }) => {
  const intl = useIntl();

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {intl.formatMessage({ id: 'invoice.title', defaultMessage: 'Faktura' })}{' '}
            {invoice.invoiceNumber}
          </Text>
          <Image src="/path/to/logo.png" style={styles.logo} />
        </View>

        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>
              {intl.formatMessage({ id: 'invoice.merchant', defaultMessage: 'Obchodník:' })}
            </Text>
            Vojtěch Laurin
          </Text>
          <Text>
            <Text style={styles.label}>
              {intl.formatMessage({ id: 'invoice.ico', defaultMessage: 'IČO:' })}{' '}
            </Text>
            06380298
          </Text>
        </View>

        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>
              {intl.formatMessage({ id: 'invoice.customer', defaultMessage: 'Zákazník:' })}
            </Text>
            {invoice.customerName}
          </Text>
          <Text>
            <Text style={styles.label}>
              {intl.formatMessage({ id: 'invoice.email', defaultMessage: 'E-mail:' })}{' '}
            </Text>
            {invoice.customerEmail}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>
                {intl.formatMessage({ id: 'invoice.description', defaultMessage: 'Popis' })}
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>
                {intl.formatMessage({ id: 'invoice.value', defaultMessage: 'Hodnota' })}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {intl.formatMessage({ id: 'invoice.price', defaultMessage: 'Cena' })}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {invoice.amount / 100} {invoice.currency}
              </Text>
            </View>
          </View>

          {/* Status Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {intl.formatMessage({ id: 'invoice.status', defaultMessage: 'Stav' })}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {invoice.status === 'PAID'
                  ? intl.formatMessage({ id: 'invoice.paid', defaultMessage: 'Zaplaceno' })
                  : intl.formatMessage({ id: 'invoice.unpaid', defaultMessage: 'Nezaplaceno' })}
              </Text>
            </View>
          </View>

          {/* Issued Date */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {intl.formatMessage({ id: 'invoice.issued', defaultMessage: 'Vystaveno' })}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {new Date(invoice.issuedAt).toLocaleDateString(intl.locale, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </Text>
            </View>
          </View>

          {invoice.notes && (
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {intl.formatMessage({ id: 'invoice.notes', defaultMessage: 'Poznámka' })}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{invoice.notes}</Text>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;

export async function downloadInvoice(invoice: Invoice) {
  const blob = await pdf(<InvoicePdf invoice={invoice} />).toBlob();
  saveAs(blob, `${invoice.invoiceNumber}.pdf`);
}

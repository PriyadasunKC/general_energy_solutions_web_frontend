import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Download, Mail, Loader2 } from 'lucide-react';
import { solarTheme } from '@/theme/theme';
import { PackageOrder } from '@/types/packageOrderTypes';
import { ToastAlert } from '@/components/ui/toast-alert';
import { AppDispatch } from '@/store/store';
import { sendPackageOrderPDF, selectPdfSending, selectPdfSendError } from '@/store/slices/packageOrderSlice';

interface PDFQuotationComponentProps {
    order: PackageOrder;
}

interface Alert {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

// PDF Styles - A4 with 1 inch (25.4mm) margins
const styles = StyleSheet.create({
    page: {
        paddingTop: 25.4,
        paddingBottom: 25.4,
        paddingLeft: 25.4,
        paddingRight: 25.4,
        fontSize: 10,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    header: {
        borderBottom: `4px solid ${solarTheme.primary[600]}`,
        paddingBottom: 20,
        marginBottom: 20,
        wrap: false, // Don't break header across pages
    },
    section: {
        marginBottom: 20,
        wrap: false, // Don't break sections in the middle
    },
    specsAndPricingContainer: {
        wrap: false, // Keep specs and pricing together on same page
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: solarTheme.primary[700],
        marginBottom: 5,
    },
    companySubtitle: {
        fontSize: 9,
        color: '#525252',
        marginBottom: 10,
    },
    companyDetails: {
        fontSize: 9,
        color: '#404040',
        lineHeight: 1.5,
    },
    quotationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: solarTheme.secondary[600],
        marginBottom: 5,
    },
    quotationDetails: {
        fontSize: 9,
        color: '#404040',
        lineHeight: 1.5,
    },
    sectionRow: {
        flexDirection: 'row',
        marginBottom: 20,
        wrap: false, // Don't break section rows
    },
    sectionHalf: {
        width: '48%',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: solarTheme.primary[700],
        marginBottom: 8,
    },
    text: {
        fontSize: 9,
        color: '#404040',
        lineHeight: 1.5,
    },
    bold: {
        fontWeight: 'bold',
    },
    table: {
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: solarTheme.primary[100],
        borderWidth: 1,
        borderColor: solarTheme.primary[300],
        padding: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: solarTheme.primary[200],
        padding: 8,
        borderTopWidth: 0,
    },
    tableCell: {
        fontSize: 9,
        color: '#000000',
    },
    tableCellHeader: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
    },
    specGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    specItem: {
        width: '48%',
        flexDirection: 'row',
        borderBottom: `1px solid ${solarTheme.primary[100]}`,
        paddingBottom: 5,
        marginBottom: 10,
        marginRight: '2%',
    },
    specLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        width: '50%',
        color: '#000000',
    },
    specValue: {
        fontSize: 9,
        width: '50%',
        color: '#404040',
    },
    pricingBox: {
        backgroundColor: '#fafafa',
        padding: 15,
        marginBottom: 20,
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${solarTheme.primary[200]}`,
        paddingVertical: 5,
    },
    pricingTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTop: `2px solid ${solarTheme.primary[600]}`,
        paddingVertical: 10,
    },
    footer: {
        borderTop: `2px solid ${solarTheme.primary[300]}`,
        paddingTop: 15,
        marginTop: 30,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 9,
        color: '#525252',
    },
});

export default function PDFQuotationComponent({ order }: PDFQuotationComponentProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [alert, setAlert] = useState<Alert | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfSent, setPdfSent] = useState(false);
    const pdfSending = useSelector(selectPdfSending);
    const pdfSendError = useSelector(selectPdfSendError);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const totalPrice = parseFloat(order.total_price);
    const originalPrice = parseFloat(order.original_price) * order.quantity;
    const savings = originalPrice - totalPrice;

    // Convert blob to base64
    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // Remove the data:application/pdf;base64, prefix
                const base64 = base64String.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    // Auto-send PDF via email when component mounts
    useEffect(() => {
        const autoSendPDF = async () => {
            if (pdfSent) return; // Don't send if already sent

            try {
                console.log('Auto-generating and sending PDF...');
                const filename = `Quotation_${order.package_code}_${order.package_order_id.slice(0, 8)}.pdf`;

                // Generate PDF blob
                const blob = await pdf(<QuotationPDF />).toBlob();

                // Convert to base64
                const pdfBase64 = await blobToBase64(blob);

                // Send to backend
                await dispatch(sendPackageOrderPDF({
                    orderId: order.package_order_id,
                    pdfBase64,
                    pdfFileName: filename,
                })).unwrap();

                setPdfSent(true);
                console.log('PDF sent successfully via email');
            } catch (error) {
                console.error('Failed to auto-send PDF:', error);
            }
        };

        autoSendPDF();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once when component mounts

    // PDF Document Component with dynamic page breaks
    const QuotationPDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header - Don't break */}
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.companyName}>General Energy Solutions</Text>
                            <Text style={styles.companySubtitle}>Leading Solar Energy Provider in Sri Lanka</Text>
                            <View style={styles.companyDetails}>
                                <Text>123 Galle Road, Colombo 03, Sri Lanka</Text>
                                <Text>Phone: +94 11 234 5678</Text>
                                <Text>Email: info@generalenergy.lk</Text>
                                <Text>Website: www.generalenergy.lk</Text>
                            </View>
                        </View>
                        <View style={{ width: '38%', alignItems: 'flex-end' }}>
                            <Text style={styles.quotationTitle}>QUOTATION</Text>
                            <View style={styles.quotationDetails}>
                                <Text><Text style={styles.bold}>Order ID:</Text> {order.package_order_id.slice(0, 8).toUpperCase()}</Text>
                                <Text><Text style={styles.bold}>Package Code:</Text> {order.package_code}</Text>
                                <Text><Text style={styles.bold}>Date:</Text> {formatDate(order.created_at)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Customer Information - Don't break */}
                <View style={styles.sectionRow}>
                    <View style={styles.sectionHalf}>
                        <Text style={styles.sectionTitle}>CUSTOMER INFORMATION</Text>
                        <View style={styles.text}>
                            <Text><Text style={styles.bold}>Name:</Text> {order.customer_name}</Text>
                            <Text><Text style={styles.bold}>Email:</Text> {order.customer_email}</Text>
                            <Text><Text style={styles.bold}>Phone:</Text> {order.customer_phone}</Text>
                        </View>
                    </View>
                    <View style={{ width: '4%' }} />
                    <View style={styles.sectionHalf}>
                        <Text style={styles.sectionTitle}>DELIVERY ADDRESS</Text>
                        <Text style={styles.text}>{order.delivery_address}</Text>
                    </View>
                </View>

                {/* Package Details Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PACKAGE DETAILS</Text>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCellHeader, { width: '25%' }]}>Items/Services</Text>
                        <Text style={[styles.tableCellHeader, { width: '30%' }]}>Brand/Type Description</Text>
                        <Text style={[styles.tableCellHeader, { width: '15%', textAlign: 'center' }]}>Quantity</Text>
                        <Text style={[styles.tableCellHeader, { width: '15%' }]}>Country</Text>
                        <Text style={[styles.tableCellHeader, { width: '15%' }]}>Warranty</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={{ width: '25%' }}>
                            <Text style={[styles.tableCell, styles.bold]}>{order.title}</Text>
                            <Text style={[styles.tableCell, { fontSize: 8, color: '#525252' }]}>{order.subtitle}</Text>
                        </View>
                        <Text style={[styles.tableCell, { width: '30%' }]}>{order.description}</Text>
                        <Text style={[styles.tableCell, { width: '15%', textAlign: 'center', fontWeight: 'bold' }]}>{order.quantity}</Text>
                        <Text style={[styles.tableCell, { width: '15%' }]}>Sri Lanka</Text>
                        <Text style={[styles.tableCell, { width: '15%' }]}>{order.specification.warranty || '25 years'}</Text>
                    </View>

                    {/* Package Items */}
                    {order.packageOrderItems && order.packageOrderItems.length > 0 && (
                        <>
                            <View style={[styles.tableRow, { backgroundColor: solarTheme.secondary[50] }]}>
                                <Text style={[styles.tableCell, styles.bold]}>Included Components:</Text>
                            </View>
                            {order.packageOrderItems.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { width: '25%', paddingLeft: 10 }]}>• {item.title}</Text>
                                    <Text style={[styles.tableCell, { width: '30%' }]}>{item.subtitle || '-'}</Text>
                                    <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>{item.quantity}</Text>
                                    <Text style={[styles.tableCell, { width: '15%' }]}>Sri Lanka</Text>
                                    <Text style={[styles.tableCell, { width: '15%' }]}>Included</Text>
                                </View>
                            ))}
                        </>
                    )}
                </View>

                {/* Technical Specifications & Pricing - Keep together on same page */}
                {order.specification && Object.keys(order.specification).length > 0 && (
                    <View style={styles.specsAndPricingContainer}>
                        {/* Technical Specifications */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>TECHNICAL SPECIFICATIONS</Text>
                            <View style={styles.specGrid}>
                                {Object.entries(order.specification).map(([key, value], index) => (
                                    <View key={index} style={styles.specItem}>
                                        <Text style={styles.specLabel}>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:</Text>
                                        <Text style={styles.specValue}>{value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Pricing */}
                        <View style={styles.section}>
                            <View style={styles.pricingBox}>
                                <View style={styles.pricingRow}>
                                    <Text style={styles.tableCell}>Package Price (Unit):</Text>
                                    <Text style={[styles.tableCell, styles.bold]}>
                                        LKR {parseFloat(order.sale_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </Text>
                                </View>
                                <View style={styles.pricingRow}>
                                    <Text style={styles.tableCell}>Quantity:</Text>
                                    <Text style={[styles.tableCell, styles.bold]}>{order.quantity}</Text>
                                </View>
                                {savings > 0 && (
                                    <View style={styles.pricingRow}>
                                        <Text style={styles.tableCell}>Discount:</Text>
                                        <Text style={[styles.tableCell, styles.bold, { color: '#16a34a' }]}>
                                            - LKR {savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.pricingTotal}>
                                    <Text style={[styles.tableCell, { fontSize: 12, fontWeight: 'bold', color: solarTheme.primary[700] }]}>
                                        TOTAL PRICE:
                                    </Text>
                                    <Text style={[styles.tableCell, { fontSize: 14, fontWeight: 'bold', color: solarTheme.primary[700] }]}>
                                        LKR {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Payment Information - Don't break */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PAYMENT INFORMATION</Text>
                    <View style={styles.text}>
                        <Text><Text style={styles.bold}>Payment Method:</Text> {order.payment_method.toUpperCase()}</Text>
                        <Text><Text style={styles.bold}>Payment Status:</Text> {order.payment_status.toUpperCase()}</Text>
                        <Text><Text style={styles.bold}>Order Status:</Text> {order.order_status.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Notes - Don't break if exists */}
                {order.notes && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>NOTES</Text>
                        <Text style={[styles.text, { fontStyle: 'italic' }]}>{order.notes}</Text>
                    </View>
                )}

                {/* Footer */}
                <View style={[styles.footer, { position: 'absolute', bottom: 25.4, left: 25.4, right: 25.4 }]}>
                    <Text style={[styles.footerText, styles.bold]}>Quotation for supply, install & commissioning of solar PV system</Text>
                    <Text style={[styles.footerText, { fontSize: 8, marginTop: 5 }]}>(CEB/LECO Charges are not Included)</Text>
                    <Text style={[styles.footerText, { fontSize: 8, marginTop: 10 }]}>Thank you for choosing General Energy Solutions</Text>
                </View>
            </Page>
        </Document>
    );

    const generatePDF = async () => {
        setIsGenerating(true);
        setAlert(null);

        try {
            console.log('Starting PDF generation...');
            const filename = `Quotation_${order.package_code}_${order.package_order_id.slice(0, 8)}.pdf`;

            const blob = await pdf(<QuotationPDF />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);

            setAlert({
                type: 'success',
                message: 'PDF downloaded successfully!'
            });

            setTimeout(() => setAlert(null), 3000);
        } catch (error) {
            console.error('Error generating PDF:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

            setAlert({
                type: 'error',
                message: `Failed to generate PDF: ${errorMessage}`
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Custom Alert */}
            {alert && (
                <ToastAlert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* Download Button */}
            <div className="flex justify-center">
                <button
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                        background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`,
                    }}
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            Download Quotation PDF
                        </>
                    )}
                </button>
            </div>

            {/* PDF Email Status */}
            {pdfSending && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">Sending quotation via email...</span>
                    </p>
                </div>
            )}

            {pdfSent && !pdfSending && !pdfSendError && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800">
                        <span className="font-semibold">Quotation PDF sent to your email successfully!</span>
                    </p>
                </div>
            )}

            {pdfSendError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-red-800">
                        <span className="font-semibold">Failed to send email:</span> {pdfSendError}
                    </p>
                </div>
            )}

            {/* PDF Preview Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span> Click Download Quotation PDF button to download a copy of your quotation.
                </p>
            </div>
        </div>
    );
}

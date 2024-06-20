'use client';

import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#000000',
    },
    tableRow: {
        flexDirection: 'row',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#000000',
    },
    tableCol: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
    },
});

const logoUrl = "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/nitttrlogo.jpg";
const BookingPDF = ({ booking, session }: any) => {
    const checkInDate = new Date(booking.bookedFromDt);
    const checkOutDate = new Date(booking.bookedToDt);

    return (
        <Document>
            <Page size="A4" style={styles.container}>

                <View style={styles.section}>
                    <Text style={styles.header}>
                        NATIONAL INSTITUTE OF <br />
                        TECHNICAL TEACHERS TRAINING AND RESEARCH, BHOPAL </Text>
                </View>

                <Text style={styles.header}>Booking Receipt</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Guest Details</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCol}>Name</Text>
                            <Text style={styles.tableCol}>Type</Text>

                        </View>
                        {booking.guests.map((guest: any) => (
                            <View key={guest.id} style={styles.tableRow}>
                                <Text style={styles.tableCol}>{guest.name}</Text>
                                <Text style={styles.tableCol}>{guest.typeOrg.replace(/_/g, ' ')}</Text>

                            </View>
                        ))}
                   

                            <Text style={styles.tableCol}>Subtotal</Text>
                            <Text style={styles.tableCol}>Rs{booking.amount}</Text>
                    
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Booking Details</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCol}>Detail</Text>
                            <Text style={styles.tableCol}>Value</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCol}>Booking ID</Text>
                            <Text style={styles.tableCol}>{booking.id}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCol}>Booked By</Text>
                            <Text style={styles.tableCol}>{session?.user.name}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCol}>Contact Number</Text>
                            <Text style={styles.tableCol}>{booking.guests[0]?.mobileNo}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCol}>Booking Date</Text>
                            <Text style={styles.tableCol}>
                                {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCol}>Payment Method</Text>
                            <Text style={styles.tableCol}>Pay at hotel</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCol}>Total Amount</Text>
                            <Text style={styles.tableCol}>Rs{booking.amount}</Text>
                        </View>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

const PrintButton = ({ booking, session }: any) => {
    const printPDF = () => {
        pdf(<BookingPDF booking={booking} session={session} />).toBlob().then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'booking-receipt.pdf';
            link.click();
        });
    };

    return (
        <button
            className="mx-auto mt-4 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={printPDF}
        >
            Download Receipt
        </button>
    );
};

export default PrintButton;
interface Reservation {
    id: string;
    customerName: string;
    phoneNumber: number | null | undefined;
    guestCount: number;
    tableNumbers: string[];
    reservationTime: Date | null;
    note: string;
    isCompleted: boolean;
}

export default Reservation;


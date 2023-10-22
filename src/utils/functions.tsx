export function handleReservationTimeRendering(reservationTime: Date | null) {
    if (reservationTime) {
        const reservationTimeDate = new Date(reservationTime);
        const reservationTimeDateToday = new Date();
        const reservationTimeDateTomorrow = new Date();
        reservationTimeDateTomorrow.setDate(reservationTimeDateTomorrow.getDate() + 1);
        if (reservationTimeDate.getDate() === reservationTimeDateToday.getDate() && reservationTimeDate.getMonth() === reservationTimeDateToday.getMonth() && reservationTimeDate.getFullYear() === reservationTimeDateToday.getFullYear()) {
            return `Today, ${reservationTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (reservationTimeDate.getDate() === reservationTimeDateTomorrow.getDate() && reservationTimeDate.getMonth() === reservationTimeDateTomorrow.getMonth() && reservationTimeDate.getFullYear() === reservationTimeDateTomorrow.getFullYear()) {
            return `Tomorrow, ${reservationTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return `${reservationTimeDate.toLocaleString('default', { month: 'long' })} ${reservationTimeDate.getDate()}, ${reservationTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    }
}

export function formatPhoneNumber(phoneNumber: number | null | undefined) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); 

    if (cleaned.length === 7) {
        return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7);
    } else if (cleaned.length >= 4) {
        const firstPart = cleaned.slice(0, 3);
        const secondPart = cleaned.slice(3, 7);
        return cleaned.length > 3 ? firstPart + '-' + secondPart + '-' + cleaned.slice(7) : firstPart + '-' + secondPart;
    } else {
        return phoneNumber;
    }
}
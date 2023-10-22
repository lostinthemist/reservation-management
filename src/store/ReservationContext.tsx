import React, { createContext, useState, useContext, ReactNode } from 'react';
import Reservation from '../interfaces/Reservation';

interface ReservationContextType {
    reservations: Reservation[];
    addReservation: (reservation: Reservation) => void;
    removeReservation: (id: string) => void;
    editReservation: (reservation: Reservation) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function useReservationContext() {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservationContext must be used within a ReservationProvider');
    }
    return context;
}

interface ReservationProviderProps {
    children: ReactNode;
}

export function ReservationProvider({ children }: ReservationProviderProps) {
    const [reservations, setReservations] = useState<Reservation[]>([
        {
            "id": "1697738736749",
            "customerName": "Vincent Smith",
            "phoneNumber": 564400004,
            "guestCount": 2,
            "tableNumbers": [
                "Table 2 · Floor 1",
                "Table 5 · Floor 1"
            ],
            "note": "I am vegetarian",
            "isCompleted": false,
            "reservationTime": new Date(2023, 9, 20, 18, 30)
        },
        {
            "id": "1697738757842",
            "customerName": "Cloud Jefferson",
            "phoneNumber": 9055011400,
            "guestCount": 6,
            "tableNumbers": [
                "Table 3 · Floor 2"
            ],
            "note": "Coming with group of friends, one has peanut allergy",
            "isCompleted": false,
            "reservationTime": new Date(2023, 5, 28, 15, 10)
        },
        {
            "id": "16977387578552",
            "customerName": "Brad Levinson",
            "phoneNumber": 1014400444,
            "guestCount": 1,
            "tableNumbers": [
                "Table 3 · Floor 1"
            ],
            "note": "Get me the best wine you have",
            "isCompleted": false,
            "reservationTime": new Date(2023, 9, 3, 21, 30)
        },
        {
            "id": "1697738757895",
            "customerName": "Leon Leonhart",
            "phoneNumber": 5011400,
            "guestCount": 2,
            "tableNumbers": [],
            "note": "It's going to be a date night, so please prepare roses on the table",
            "isCompleted": false,
            "reservationTime": new Date(2023, 7, 11, 22, 30)
        }
    ]);
    const addReservation = (reservation: Reservation) => {
        setReservations([...reservations, reservation]);
    };

    const removeReservation = (id: string) => {
        setReservations(reservations.filter((res) => res.id !== id));
    };

    const editReservation = (updatedReservation: Reservation) => {
        const updatedReservations = reservations.map((res) =>
          res.id === updatedReservation.id ? updatedReservation : res
        );
        setReservations(updatedReservations);
      };

    return (
        <ReservationContext.Provider value={{ reservations, addReservation, removeReservation, editReservation  }}>
            {children}
        </ReservationContext.Provider>
    );

};
import '../App.css';
import { Link } from "react-router-dom";
import { useReservationContext } from "../store/ReservationContext";
import { handleReservationTimeRendering, formatPhoneNumber } from "../utils/functions";
import Reservation from "../interfaces/Reservation";
import styled from "styled-components";
import { ReactComponent as AddIcon } from '../assets/icons/add.svg';
import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg';
import { ReactComponent as SelectDateIcon } from '../assets/icons/event_available.svg';
import { ReactComponent as GroupIcon } from '../assets/icons/group.svg';
import { ReactComponent as PhoneIcon } from '../assets/icons/phone.svg';
import { ReactComponent as EditIcon } from '../assets/icons/edit.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';

const DashboardWrapper = styled.div`
  background-color: #f5f5f4;
`;

const Dashboard = () => {
    const { reservations, removeReservation, editReservation } = useReservationContext();

    const handleRemoveReservation = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        removeReservation(id);
    };

    const handleFinishedReservation = (id: string) => {
        const reservationToMarkAsCompleted = reservations.find((reservation) => reservation.id === id);

        if (!reservationToMarkAsCompleted) {
            return;
        }

        reservationToMarkAsCompleted.isCompleted = true;
        editReservation(reservationToMarkAsCompleted);
    };

    function groupTableNumbersByFloor(tableNumbers: string[]) {
        const tableNumberGroups = new Map<string, string[]>();
        tableNumbers = tableNumbers.map((tableNumber) => tableNumber.replace('Table ', ''));

        for (const tableNumber of tableNumbers) {
            const [table, floor] = tableNumber.split(' · ');
            if (!tableNumberGroups.has(floor)) {
                tableNumberGroups.set(floor, [table]);
            } else {
                tableNumberGroups.get(floor)!.push(table);
            }
        }

        return tableNumberGroups;
    }

    const activeReservations = reservations.filter((reservation) => !reservation.isCompleted);

    return (
        <DashboardWrapper>
            <nav className="App-nav">
                <Link to="/addReservation" className="addBtn"><AddIcon className='svg-icon' width={19} height={19} /> Add Reservation</Link>
                <h1 className="App-nav-h1">Reservation <span className="App-nav-reservationCounter">{activeReservations.length}</span></h1>
                <Link to="/"><CloseIcon className="svg-icon" width={26} height={26} /></Link>
            </nav>
            <div className="container px-4">
                <ul className="row gx-4 App-reservation-ul">
                    {activeReservations.map((reservation: Reservation) => (
                        <li className="col-12 col-md-6 col-lg-4 App-reservation-li" key={reservation.id}>
                            <Link to={`/editReservation/${reservation.id}`}>
                                <div className="App-reservation-li-content">
                                    <div className="d-flex justify-content-start align-items-center">
                                        <p className="me-3 fw-bold">{reservation.customerName}</p>
                                        <p className="App-reservation-phone"><PhoneIcon className="svg-icon me-2" width={20} height={20} />{formatPhoneNumber(reservation.phoneNumber)}</p>
                                    </div>
                                    <div className="d-flex justify-content-start align-items-center mb-3">
                                        <SelectDateIcon className="svg-icon me-2" width={20} height={20} />
                                        <p className="mb-0">{handleReservationTimeRendering(reservation.reservationTime)}</p>
                                    </div>
                                    <p className="fw-bold"><GroupIcon className="svg-icon me-2" width={20} height={20} /> {reservation.guestCount}</p>
                                    {reservation.tableNumbers.length !== 0 ? (
                                        <p>Reserved Table{' '}
                                            {Array.from(groupTableNumbersByFloor(reservation.tableNumbers)).map(
                                                ([floor, tables], index) => (
                                                    <span key={index}>
                                                        {index > 0 && ', '}
                                                        {tables.length === 1 ? (
                                                            <span><span className="fw-bold">{tables[0]}</span> · {floor}</span>
                                                        ) : (
                                                            <span><span className="fw-bold">{tables.join(', ')}</span> · {floor}</span>
                                                        )}
                                                    </span>
                                                )
                                            )}
                                        </p>
                                    ) : (
                                        <p className="fst-italic">No Selected Table</p>
                                    )}
                                    <div className="d-flex justify-content-start align-items-center mb-3">
                                        {reservation.note !== "" && <p className="mb-0">{reservation.note}<EditIcon className="svg-icon ms-2" width={20} height={20} /></p>}
                                    </div>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <button className="btn btn-remove me-3" onClick={(e) => handleRemoveReservation(reservation.id, e)}><TrashIcon className="svg-icon" width={25} height={25} /></button>
                                        <button className="btn btn-confirm" onClick={(e) => { e.preventDefault(); handleFinishedReservation(reservation.id); }}>
                                            Seated
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </DashboardWrapper>
    )
};

export default Dashboard;
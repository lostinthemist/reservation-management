import { useState } from "react";
import '../App.css';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useReservationContext } from "../store/ReservationContext";
import { handleReservationTimeRendering } from "../utils/functions";
import Reservation from "../interfaces/Reservation";
import Select, { ActionMeta, MultiValue } from "react-select";
import styled from 'styled-components';
import tableOptions from "../interfaces/TableOptions";
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-modal';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { ReactComponent as AlarmOnIcon } from '../assets/icons/alarm_on.svg';
import { ReactComponent as DateIcon } from '../assets/icons/today.svg';
import { ReactComponent as ChevronUp } from '../assets/icons/chevron-up.svg';
import { ReactComponent as ChevronDown } from '../assets/icons/chevron-down.svg';
import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg';
import { ReactComponent as SelectDateIcon } from '../assets/icons/event_available.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import { ReactComponent as PlusIcon } from '../assets/icons/math-plus.svg';
import { ReactComponent as MinusIcon } from '../assets/icons/math-minus.svg';
import { ReactComponent as BackIcon } from '../assets/icons/keyboard_backspace.svg';

const AddReservationWrapper = styled.div`
  background-color: #fff;
`;

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EditReservation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { reservations, editReservation, removeReservation } = useReservationContext();
    const [value, onChange] = useState<Value>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleModalClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(false);
    };

    const existingReservation = reservations.find((res) => res.id === id);

    const [formData, setFormData] = useState<Reservation>(
        existingReservation ?? {
            id: "",
            customerName: "",
            phoneNumber: undefined,
            guestCount: 0,
            tableNumbers: [],
            note: "",
            isCompleted: false,
            reservationTime: null
        }
    );

    const handleEdit = () => {
        if (!formData || formData.customerName === "" || Number.isNaN(formData.phoneNumber)) {
            return;
        }
        const editedReservation = {
            id: formData.id,
            customerName: formData.customerName,
            phoneNumber: formData.phoneNumber,
            guestCount: formData.guestCount,
            tableNumbers: formData.tableNumbers,
            note: formData.note,
            isCompleted: false,
            reservationTime: value as Date
        };

        editReservation(editedReservation);
        navigate('/');
    };

    const handleRemoveReservation = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        removeReservation(id);
        navigate('/');
    };

    const handleFinishedReservation = (id: string) => {
        const reservationToMarkAsCompleted = reservations.find((reservation) => reservation.id === id);

        if (!reservationToMarkAsCompleted) {
            return;
        }

        reservationToMarkAsCompleted.isCompleted = true;

        editReservation(reservationToMarkAsCompleted);
        navigate('/');
    };

    const increaseCount = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (formData) {
            setFormData({
                ...formData,
                guestCount: formData.guestCount + 1
            } as Reservation);
        }
    };

    const decreaseCount = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (formData.guestCount === 0) {
            return;
        }
        if (formData) {
            setFormData({
                ...formData,
                guestCount: formData.guestCount - 1
            } as Reservation);
        }
    }

    const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            customerName: value,
        }));
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const value = e.target.value;
        // setFormData((prevData) => ({
        //     ...prevData,
        //     phoneNumber: parseInt(value),
        // }));
        const value = e.target.value;
        const parsedValue = parseInt(value);

        if (!isNaN(parsedValue) || value === "") {
            // Check if it's a valid number or an empty string
            setFormData((prevData) => ({
                ...prevData,
                phoneNumber: value === "" ? null : parsedValue,
            }));
        }
    };

    const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setFormData((prevData) => ({
            ...prevData,
            guestCount: value,
        }));
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            note: value,
        }));
    };

    const handleTableNumbersChange = (
        selectedOptions: MultiValue<{ value: string; label: string }>,
        actionMeta: ActionMeta<{ value: string; label: string }>
    ) => {
        if (actionMeta.action === 'select-option' || actionMeta.action === 'remove-value') {
            const selectedTableNumbers = selectedOptions.map((option) => option.value);
            setFormData({ ...formData, tableNumbers: selectedTableNumbers });
        }
    };

    const handleDateTimeChange = (value: Value) => {
        onChange(value as Date);
    };

    const incrementHour = (e: React.MouseEvent) => {
        e.preventDefault();
        const newDate = new Date(value as Date);
        newDate.setHours(newDate.getHours() + 1);
        handleDateTimeChange(newDate);
    };

    const decrementHour = (e: React.MouseEvent) => {
        e.preventDefault();
        const newDate = new Date(value as Date);
        newDate.setHours(newDate.getHours() - 1);
        handleDateTimeChange(newDate);
    };

    const incrementMinute = (e: React.MouseEvent) => {
        e.preventDefault();
        const newDate = new Date(value as Date);
        newDate.setMinutes(newDate.getMinutes() + 1);
        handleDateTimeChange(newDate);
    };

    const decrementMinute = (e: React.MouseEvent) => {
        e.preventDefault();
        const newDate = new Date(value as Date);
        newDate.setMinutes(newDate.getMinutes() - 1);
        handleDateTimeChange(newDate);
    };

    const toggleAMPM = (e: React.MouseEvent) => {
        e.preventDefault();
        const newDate = new Date(value as Date);
        if (newDate.getHours() >= 12) {
            newDate.setHours(newDate.getHours() - 12);
        } else {
            newDate.setHours(newDate.getHours() + 12);
        }
        handleDateTimeChange(newDate);
    };

    return (
        <AddReservationWrapper>
            <nav className="App-nav">
                <button className="btn btn-remove fw-bold" onClick={handleEdit}><BackIcon className="svg-icon me-2" width={30} height={30} />Save</button>
                <h1 className="App-nav-h1">Edit Reservation</h1>
                <Link to="/"><CloseIcon className="svg-icon" width={26} height={26} /></Link>
            </nav>
            <div className="container">
                {formData ? (
                    <form>
                        <div className="my-5 d-flex flex-column align-items-start justify-content-start flex-lg-row justify-content-md-between align-items-lg-center">
                            <div className="form-floating">
                                <input className="form-control" placeholder="" type="text" value={formData.customerName} name="customerName" required onChange={handleCustomerNameChange} id="nameInput" />
                                <label className={formData.customerName !== "" ? "label-active" : ""} htmlFor="nameInput">Name <span>*</span></label>
                            </div>
                            <div className="form-floating">
                                <input className="form-control" placeholder="" type="tel" value={formData.phoneNumber !== null ? formData.phoneNumber : ""} name="phoneNumber" required onChange={handlePhoneNumberChange} id="phoneInput" />
                                <label className={formData.phoneNumber !== 0 ? "label-active" : ""} htmlFor="phoneInput">Phone <span>*</span></label>
                            </div>
                            <div className="date-btn-div">
                                <button className="selectDateTimeBtn" onClick={handleModalOpen}><SelectDateIcon className="svg-icon me-2" width={25} height={25} />{formData.reservationTime === null ? "Select Date" : (handleReservationTimeRendering(formData.reservationTime))}</button>
                            </div>
                        </div>
                        <div className="my-5 d-flex flex-column align-items-start justify-content-start flex-md-row align-items-md-center justify-content-md-between">
                            <div className="d-flex mb-3 mb-md-0 align-items-center justify-content-between">
                                <label className="me-3 fw-bold">Guests</label>
                                <button className="btn btn-count" onClick={decreaseCount}><MinusIcon className="svg-icon" width={28} height={28} /></button>
                                <input readOnly={true} className="mx-3 guestCountInput" type="number" name="guestCount" value={formData.guestCount} onChange={handleGuestCountChange} min="0" />
                                <button className="btn btn-count" onClick={increaseCount}><PlusIcon className="svg-icon" width={28} height={28} /></button>
                            </div>
                            <div className="select-div">
                                <Select
                                    isMulti
                                    name="tableNumbers"
                                    options={tableOptions}
                                    className="basic-multi-select guest-select"
                                    classNamePrefix="select"
                                    value={tableOptions.filter((option) => formData.tableNumbers.includes(option.value))}
                                    onChange={handleTableNumbersChange}
                                />
                            </div>
                        </div>

                        <div className="my-5">
                            <textarea rows={5} className="w-100" placeholder="Add Note..." name="note" value={formData.note} onChange={handleNoteChange}></textarea>
                        </div>

                        <div className="d-flex justify-content-between">
                            <button className="btn btn-remove me-3" onClick={(e) => handleRemoveReservation(formData.id, e)}><TrashIcon className="svg-icon" width={25} height={25} /></button>
                            <button className="btn btn-confirm" onClick={(e) => { e.preventDefault(); handleFinishedReservation(formData.id); }}>
                                Seated
                            </button>
                        </div>
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={handleModalClose}
                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                                },
                                content: {
                                    margin: 'auto',
                                    padding: '20px',
                                    height: '400px'
                                }
                            }}
                        >
                            <div className="h-100 d-flex flex-column">
                                <div className="d-flex align-items-center mb-3">
                                    <AlarmOnIcon className="svg-icon me-2" width={25} height={25} />
                                    <div className="datetime-picker">
                                        <DateTimePicker
                                            onChange={onChange}
                                            value={value}
                                            format="h:mm a"
                                            calendarIcon={null}
                                            clearIcon={null}
                                            disableClock={true}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    <DateIcon className="svg-icon me-2" width={25} height={25} />
                                    <div className="datetime-picker">
                                        <DateTimePicker
                                            onChange={onChange}
                                            value={value}
                                            format="MMMM dd"
                                            clearIcon={null}
                                        />
                                    </div>
                                </div>
                                <div className="time-picker-incremental d-flex flex-column align-items-center">
                                    <div className="d-flex align-items-center">
                                        <button className="hour-addRemove" onClick={incrementHour}><ChevronUp className="svg-icon" width={16} height={16} /></button>
                                        <button className="minute-addRemove" onClick={incrementMinute}><ChevronUp className="svg-icon" width={16} height={16} /></button>
                                        <button className="AMPM-addRemove" onClick={toggleAMPM}><ChevronUp className="svg-icon" width={16} height={16} /></button>
                                    </div>
                                    <DateTimePicker
                                        onChange={onChange}
                                        value={value}
                                        format="h:mm a"
                                        calendarIcon={null}
                                        clearIcon={null}
                                        disableClock={true}
                                    />
                                    <div className="d-flex align-items-center">
                                        <button className="hour-addRemove" onClick={decrementHour}><ChevronDown className="svg-icon" width={16} height={16} /></button>
                                        <button className="minute-addRemove" onClick={decrementMinute}><ChevronDown className="svg-icon" width={16} height={16} /></button>
                                        <button className="AMPM-addRemove" onClick={toggleAMPM}><ChevronDown className="svg-icon" width={16} height={16} /></button>
                                    </div>
                                </div>
                                <div className="d-flex mt-auto justify-content-between">
                                    <button className="btn btn-remove me-3" onClick={handleModalClose}><TrashIcon className="svg-icon" width={25} height={25} /></button>
                                    <button className="btn btn-confirm" onClick={handleModalClose}>Save</button>
                                </div>
                            </div>
                        </Modal>
                    </form>
                ) : null}
            </div>
        </AddReservationWrapper>
    )
};

export default EditReservation;
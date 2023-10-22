import React, { useState } from "react";
import '../App.css';
import { Link, useNavigate } from "react-router-dom";
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
import { ReactComponent as EditIcon } from '../assets/icons/edit.svg';

const AddReservationWrapper = styled.div`
  background-color: #fff;
`;

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const AddReservation = () => {
    const navigate = useNavigate();
    const { addReservation } = useReservationContext();
    const [value, onChange] = useState<Value>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [customerName, setCustomerName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [selectBtn, setSelectBtn] = useState<boolean>(true);

    const handleModalOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleModalClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(false);
    };

    const handleModalCloseAndSave = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(false);
        setSelectBtn(false);
    }

    const [formData, setFormData] = useState<Reservation>({
        id: new Date().getTime().toString(),
        customerName: '',
        phoneNumber: 0,
        guestCount: 1,
        tableNumbers: [],
        note: '',
        isCompleted: false,
        reservationTime: null
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (customerName.trim() === '' || phoneNumber.trim() === '') {
            return;
        }

        const newReservation = {
            id: formData.id,
            customerName: customerName,
            phoneNumber: parseInt(phoneNumber),
            guestCount: formData.guestCount,
            tableNumbers: formData.tableNumbers,
            note: formData.note,
            isCompleted: false,
            reservationTime: value as Date
        };
        addReservation(newReservation);
        navigate('/');
    };

    const increaseCount = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFormData({
            ...formData,
            guestCount: formData.guestCount + 1
        });
    };

    const decreaseCount = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (formData.guestCount === 0) {
            return;
        }
        setFormData({
            ...formData,
            guestCount: formData.guestCount - 1
        });
    };

    const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                <Link className="btn btn-remove" to="/"><BackIcon className="svg-icon" width={30} height={30} /></Link>
                <h1 className="App-nav-h1">Add Reservation</h1>
                <Link to="/"><CloseIcon className="svg-icon" width={26} height={26} /></Link>
            </nav>
            <div className="container">
                <form onSubmit={handleSubmit}>

                    <div className="my-5 d-flex flex-column align-items-start justify-content-start flex-lg-row justify-content-md-between align-items-lg-center">
                        <div className="form-floating">
                            <input className="form-control" placeholder="" type="text" value={customerName} name="customerName" required onChange={(e) => setCustomerName(e.target.value)} id="nameInput" />
                            <label htmlFor="nameInput">Name <span>*</span></label>
                        </div>
                        <div className="form-floating">
                            <input className="form-control" placeholder="" type="tel" value={phoneNumber} name="phoneNumber" required onChange={(e) => setPhoneNumber(e.target.value)} id="phoneInput" />
                            <label htmlFor="phoneInput">Phone <span>*</span></label>
                        </div>
                        <div className="date-btn-div">
                            {selectBtn && <button className="selectDateTimeBtn" onClick={handleModalOpen}><SelectDateIcon className="svg-icon me-2" width={25} height={25} />Select Date</button>}
                            {!selectBtn && <button className="selectDateTimeBtn" onClick={handleModalOpen}><SelectDateIcon className="svg-icon me-2" width={25} height={25} />{handleReservationTimeRendering(value as Date)}</button>}
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
                                placeholder="Select Table"
                                className="basic-multi-select guest-select"
                                classNamePrefix="select"
                                value={tableOptions.filter((option) => formData.tableNumbers.includes(option.value))}
                                onChange={handleTableNumbersChange}
                            />
                        </div>
                    </div>

                    <div className="form-floating my-5">
                        <textarea rows={5} className="w-100 form-control" name="note" onChange={handleNoteChange} id="noteInput"></textarea>
                        <label htmlFor="noteInput">Add note... <EditIcon className="svg-icon ms-2" width={20} height={20} /></label>
                    </div>
                    <button className="btn btn-confirm" type="submit" disabled={customerName.trim() === '' || phoneNumber.trim() === ''}
                        style={{
                            opacity: customerName.trim() === '' || phoneNumber.trim() === '' ? 0.5 : 1
                        }}>
                        Save
                    </button>
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={handleModalClose}
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.4)'
                            },
                            content: {
                                width: '400px',
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
                                <button className="btn btn-confirm" onClick={handleModalCloseAndSave}>Save</button>
                            </div>
                        </div>
                    </Modal>
                </form>
            </div>
        </AddReservationWrapper>
    )
};

export default AddReservation;
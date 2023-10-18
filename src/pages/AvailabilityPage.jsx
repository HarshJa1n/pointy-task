

import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styled from 'styled-components';

const AvailabilityPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const selectedDuration = params.get('duration');
    const selectedSeats = params.get('seats');
    const payloadID = params.get('pid')
    const [workObj, setWorkObj] = useState([])
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [blockedSlots, setBlockedSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);


    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const SlotContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
        
    `;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIyMDIzLTA4LTEwVDAwOjAwOjAwWiIsInVzZXJfaWQiOjEyfQ.VFR81ErQqRHEce-jRtpXbvU2zFhQQP4MfrNzLXFhvMU";
    const config = {
        headers: {
            Authorization: token
        }
    };

    useEffect(() => {
        if (selectedDate !== '') {
            const url = `http://api.internship.appointy.com:8000/space-payload/v1/working-hours?payloadId=${payloadID}&startTime=${selectedDate}T00:00:00Z&endTime=${selectedDate}T23:59:59Z`

            axios.get(url, config)
                .then(response => {
                    console.log("workerObj", response);
                    const data = response.data;
                    setWorkObj(data);
                    const allSlots = [];
                    data.forEach(entry => {
                        const { start_time, end_time } = entry;
                        const startTime = moment(start_time).utc();
                        const endTime = moment(end_time).utc();

                        while (startTime < endTime) {
                            if (!isInBreak(startTime, x.breakTime)) {
                                allSlots.push(startTime.format("HH:mm"));
                            }
                            startTime.add(x.nextSlot, 'minutes');
                        }
                    });

                    setSlots(allSlots);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }, [selectedDate]);
    useEffect(() => {
        const blockedSlotsUrl = `http://api.internship.appointy.com:8000/space-payload/v1/block-hours?payloadId=${payloadID}&startTime=${selectedDate}T00:00:00Z&endTime=${selectedDate}T23:59:59Z`



        axios.get(blockedSlotsUrl, config)
            .then(response => {
                console.log("Blocked Slots Response", response);
                const blockedData = response.data;
                setBlockedSlots(blockedData);


                const BlockedSlotsnow = [];
                blockedData.forEach(entry => {
                    const { start_time, end_time } = entry;
                    const startTime = moment(start_time).utc();
                    const endTime = moment(end_time).utc();

                    while (startTime < endTime) {
                        if (!isInBreak(startTime, x.breakTime)) {
                            BlockedSlotsnow.push(startTime.format("HH:mm"));
                        }
                        startTime.add(x.nextSlot, 'minutes');
                    }
                });

                setBlockedSlots(BlockedSlotsnow);
            })
            .catch(error => {
                console.error('Error fetching blocked slots!', error);
            });
    }, [selectedDate]);
    useEffect(() => {
        const bookedSlotsUrl = `http://api.internship.appointy.com:8000/space-payload/v1/bookings?payloadId=${payloadID}&startTime=${selectedDate}T00:00:00Z&endTime=${selectedDate}T23:59:59Z`



        axios.get(bookedSlotsUrl, config)
            .then(response => {
                console.log("Booked Slots Response", response);
                const bookedData = response.data;
                setBookedSlots(bookedData);


                const BookedSlotsnow = [];
                bookedData.forEach(entry => {
                    const { start_time, end_time, quantity } = entry;
                    const startTime = moment(start_time).utc();
                    const endTime = moment(end_time).utc();
                    const remainingSeats = 10 - quantity

                    if (remainingSeats <= selectedSeats) {
                        while (startTime < endTime) {
                            if (!isInBreak(startTime, x.breakTime)) {
                                BookedSlotsnow.push(startTime.format("HH:mm"));
                            }
                            startTime.add(x.nextSlot, 'minutes');
                        }

                    }


                });

                setBookedSlots(BookedSlotsnow);
                console.log("booked", BookedSlotsnow);
            })
            .catch(error => {
                console.error('Error fetching booked slots!', error);
            });
    }, [selectedDate]);


    const x = {
        nextSlot: selectedDuration,
        breakTime: [

        ],
        startTime: '9:00',
        endTime: '18:00'
    };

    let slotTime = moment(x.startTime, "HH:mm");
    const endTime = moment(x.endTime, "HH:mm");

    function isInBreak(slotTime, breakTimes) {
        return breakTimes.some((br) => {
            return slotTime >= moment(br[0], "HH:mm") && slotTime < moment(br[1], "HH:mm");
        });
    }

    useEffect(
        () => {
            console.log("slots", slots);
        }, [slots]
    )

    let times = [];
    while (slotTime < endTime) {
        if (!isInBreak(slotTime, x.breakTime)) {
            times.push(slotTime.format("HH:mm"));
        }
        slotTime = slotTime.add(x.nextSlot, 'minutes');
    }

    console.log("Time slots: ", times);

    const slotsWithHighlight = slots.map(slot => {
        const isBlocked = blockedSlots.includes(slot);
        const isBooked = bookedSlots.includes(slot);
        return { time: slot, blocked: isBlocked, booked: isBooked };
    });
    return (
        <>
            <Typography variant="h2">Select Date and Time </Typography>
            <Typography variant='h7'>for {payloadID} - {selectedDuration}minutes - {selectedSeats} seats</Typography>
            <TextField
                label="Select Date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{
                    shrink: true,
                }}
                style={{ marginTop: "100px" }}
            />
            {selectedDate !== '' && slots && (
                <div>Slots for {selectedDate}</div>
            )}

            <SlotContainer>

                {slotsWithHighlight.map(slot => (
                    <div key={slot.time} >
                        <Card sx={{ margin: 2 }} >
                            <CardContent style={{ backgroundColor: slot.blocked ? 'red' : 'white' }}>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    {slot.time}

                                </Typography>
                                <Typography>
                                    {(slot.blocked || !slot.booked) ? "not-available" : "available"}
                                </Typography>
                                <Typography>
                                    {(slot.booked) ? "" : "(booked)"}
                                </Typography>


                            </CardContent>

                        </Card>
                    </div>
                ))}
                <Typography>
                    red implies blocked
                </Typography>
            </SlotContainer>

        </>
    )

};

export default AvailabilityPage
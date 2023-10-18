
import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */


const ModalComponent = ({ payload, onClose }) => {
    const [durationOptions, setDurationOptions] = useState([]);
    const seatOptions = Array.from({ length: 31 }, (_, i) => i + 1);
    const [selectedDuration, setSelectedDuration] = useState('30');
    const [selectedSeats, setSelectedSeats] = useState('1');
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIyMDIzLTA4LTEwVDAwOjAwOjAwWiIsInVzZXJfaWQiOjEyfQ.VFR81ErQqRHEce-jRtpXbvU2zFhQQP4MfrNzLXFhvMU"
        const config = {
            headers: {
                Authorization: token
            }
        };
        axios.get(' http://api.internship.appointy.com:8000/space-payload/v1/durations', config)
            .then(response => {
                console.log("dur res", response);
                const dataObj = response.data;

                const durationArr = dataObj.map((item) => item.seconds / 60);
                console.log("durarr", durationArr);
                setDurationOptions(durationArr);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });


    }, []);

    const handleNext = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleSubmit = () => {
        const pid = `${payload.id}`
        console.log(pid);


        navigate(`/availability?pid=${payload.id}&duration=${selectedDuration}&seats=${selectedSeats}`);

    };

    return (
        <Modal
            open={true}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Payload Booking
                </Typography>
                {currentPage === 1 && (
                    <>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Select Duration:
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            for {payload.name}
                        </Typography>



                        <select value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)}>
                            {durationOptions.map((option, index) => (
                                <option key={index} value={option}>{option} minutes</option>
                            ))}
                        </select>
                        <Button variant="contained" onClick={handleNext}>Next</Button>
                    </>
                )}
                {currentPage === 2 && (
                    <>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Select Number of Seats:
                            <select value={selectedSeats} onChange={(e) => setSelectedSeats(e.target.value)}>
                                {seatOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </Typography>
                        <Button variant="contained" onClick={handlePrevious}>Previous</Button>

                        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default ModalComponent;
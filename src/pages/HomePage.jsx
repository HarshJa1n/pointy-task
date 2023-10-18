
import { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import ModalComponent from '../components/Modal';


const HomePage = () => {
    const [payloads, setPayloads] = useState([]);
    const [selectedPayload, setSelectedPayload] = useState(null);

    useEffect(() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIyMDIzLTA4LTEwVDAwOjAwOjAwWiIsInVzZXJfaWQiOjEyfQ.VFR81ErQqRHEce-jRtpXbvU2zFhQQP4MfrNzLXFhvMU"
        const config = {
            headers: {
                Authorization: token
            }
        };
        axios.get(' http://api.internship.appointy.com:8000/space-payload/v1/payloads', config)
            .then(response => {
                console.log(response);
                setPayloads(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleBookButtonClick = (payload) => {
        setSelectedPayload(payload);
    };

    return (
        <div>
            <Typography variant="h2">Space Payload Booking System</Typography>
            {payloads.map((payload, index) => (
                <List key={index}>
                    <ListItem disablePadding>
                        <ListItemIcon>j</ListItemIcon>
                        <ListItemText primary={payload.name} />
                        <ListItemButton>
                            <Button
                                variant="contained"
                                onClick={() => handleBookButtonClick(payload)}
                            >
                                Select
                            </Button>
                        </ListItemButton>
                    </ListItem>
                </List>
            ))}
            <Button variant="contained">Select Date and Time</Button>

            {/* Render the ModalComponent */}
            {selectedPayload && (
                <ModalComponent
                    payload={selectedPayload}
                    onClose={() => setSelectedPayload(null)}
                />
            )}
        </div>
    );
};

export default HomePage;
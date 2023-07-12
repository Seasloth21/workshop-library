import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (disableLoadState) => {
        if(!disableLoadState) setIsLoading(true);
        try {
            const response = await fetch('/data-api/rest/Item');
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setItems(data.value);
        } catch (error) {
            setError(error);
        }
        setIsLoading(false);
    };

    const deleteItem = async (id) => {
        try {
            const response = await fetch(`/data-api/rest/Item/id/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-MS-API-ROLE' : 'admin',
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            await fetchData(true);
        } catch (error) { }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='item-list'>
            <Card>
                <TableContainer component={Paper}>
                    <Table  aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow
                                    key={item.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {item.category}
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="error" onClick={() => deleteItem(item.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
    </div>
    );
};

export default ItemList;
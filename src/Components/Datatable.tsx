import React, { FormEvent, useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { visuallyHidden } from '@mui/utils';
import axios from "axios";
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';


interface Values {
    Name: string,
    Role: string,
}
interface AddValues {
    Url: string,
    Name: string,
    Email: string,
    Role: string,

}


interface Data {
    image: string;
    name: string;
    email: string;
    role: string;
    lastlogin: string;
    satus: string;
    id: string;
}

function createData(
    image: string,
    name: string,
    email: string,
    role: string,
    lastlogin: string,
    satus: string,
    id: string,
): Data {
    return {
        image,
        name,
        email,
        role,
        lastlogin,
        satus,
        id
    };
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}


function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'satus',
        numeric: false,
        disablePadding: true,
        label: 'Status',
    },
    {
        id: 'role',
        numeric: false,
        disablePadding: true,
        label: 'Role',
    },
    {
        id: 'lastlogin',
        numeric: false,
        disablePadding: true,
        label: 'Last Login',
    },
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: '',
    }
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}



export default function EnhancedTable() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = useState<Data[]>([]);
    const [formvalue, setFormvalue] = useState<Values>({
        Name: '',
        Role: '',
    });
    const [adduservalue, setadduservalue] = useState<AddValues>({
        Url: '',
        Name: '',
        Email: '',
        Role: '',
    });

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


    const fetchdata = () => {
        axios.get("https://63c2b94cb0c286fbe5f25686.mockapi.io/api/intern/free")
            .then((Response) => {
                console.log(Response.data)
                setRows(Response.data)
            })
    }

    const DeleteUser = () => {

        selected.map((value) => {

            setRows(rows.filter(item => item.email !== value));

        })
        console.log(selected)
    }

    const UpdateUser = () => {

        const val = document.querySelector('#popupbox') as HTMLDivElement;
        if (val.style.display == "block") {
            val.style.display = "none";
        }
        else {
            val.style.display = "block";
        }

    }
    const AddUser = () => {
        const val = document.querySelector('#AddUser') as HTMLDivElement;
        if (val.style.display == "block") {
            val.style.display = "none";
        }
        else {
            val.style.display = "block";
        }

    }
    const handleChangeAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setadduservalue((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const handleAddSubmit = (event: FormEvent<HTMLFormElement>) => {
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        const val = document.querySelector('#adduserform') as HTMLFormElement;
        val.reset();
        AddUser();

        setRows([...rows, {
            image: adduservalue.Url,
            name: adduservalue.Name,
            email: adduservalue.Email,
            role: adduservalue.Role,
            lastlogin: "12:08:90",
            satus: "online",
            id: "rows.length+1"
        }])

    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormvalue((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const val = document.querySelector('#edituserform') as HTMLFormElement;
        val.reset();
        UpdateUser();

        rows.map((temp) => {

            selected.map((value) => {
                if (value == temp.email) {
                    temp.name = formvalue.Name;
                    temp.role = formvalue.Role;

                }
            })

        })
        console.log(selected)
        setSelected([])

    }

    const DownloadCSV = () => {

        axios({

            url: 'https://63c2b94cb0c286fbe5f25686.mockapi.io/api/intern/free', //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'data.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        })
    }

    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <Box style={{ margin: "2rem" }}>

            <Paper sx={{ mb: 2 }} style={{ margin: "2rem", padding: "1rem", backgroundColor: "#F8F8FF" }}>
                <Toolbar style={{ display: "flex", position: "relative", }}>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", justifyContent: "center", height: "30px" }}>
                            <h5>
                                Users
                            </h5>
                            <p style={{ marginLeft: "15px", marginTop: "3px", fontWeight: 600, color: "green", backgroundColor: "#E0F9F1", height: "70%", borderRadius: "20%", fontSize: "14px", paddingLeft: "2px", paddingRight: "2px" }}>{rows.length} users</p>
                        </div>

                        <p >
                            Manage your team menmbers and their account permission here.
                        </p>
                    </div>
                    <div style={{ position: "absolute", right: "15px", top: "20%" }}>
                        <Button outline color="primary" style={{ marginRight: "0.5rem" }} onClick={DownloadCSV}>
                            <CloudDownloadOutlinedIcon sx={{ marginRight: "10px", marginTop: "-4px" }} />
                            Download CSV
                        </Button>
                        <Button color="primary" onClick={AddUser}>
                            <AddOutlinedIcon sx={{ marginRight: "10px", marginTop: "-4px" }} />
                            Add User
                        </Button>
                    </div>

                </Toolbar>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.email)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                            style={{ height: "80px" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                style={{ width: "55%", height: "40px", padding: "none" }}
                                            >
                                                <div style={{ display: "flex", alignItems: 'center', marginTop: "-20px", marginBottom: "-20px" }}>
                                                    <div >
                                                        <img style={{ width: "40px", height: "40px", borderRadius: "100%" }} src={row.image} />
                                                    </div>
                                                    <div style={{ height: "50px", marginLeft: "1rem", paddingTop: "0.5rem" }}>
                                                        <h6 style={{ marginBottom: "0px", fontSize: "13px", fontWeight: 600 }}>{row.name}</h6>
                                                        <p style={{ fontSize: "12px", color: "#757575", fontWeight: 500 }}>{row.email}</p>
                                                    </div>
                                                </div>

                                            </TableCell>
                                            <TableCell component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none">
                                                <p style={{ fontSize: "12px", fontWeight: 600, color: "green", backgroundColor: "#E0F9F1", width: "70px", paddingLeft: "5px", borderRadius: "20%", marginLeft: "-10px", marginTop: "18px" }}>

                                                    <FiberManualRecordIcon style={{ fontSize: "10px", fill: "green", marginRight: "5px" }} />
                                                    Active</p>
                                            </TableCell>
                                            <TableCell component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none" style={{ fontSize: "13px", color: "#757575", fontWeight: 500 }}>{row.role}</TableCell>
                                            <TableCell component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none">{row.lastlogin}</TableCell>
                                            <TableCell component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none">

                                                <DeleteIcon sx={{ fill: "black" }} onClick={DeleteUser} style={{height:"30px",width:"30px",marginRight:"1rem"}}  />

                                                <EditOutlinedIcon sx={{ fill: "black" }} onClick={UpdateUser} style={{height:"30px",width:"30px",marginRight:"1rem"}} />

                                            </TableCell>

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
            <div id='popupbox' style={{ display: "none", position: "absolute", height: "55%", width: "33%", top: "22%", left: "33%", border: "2px solid black", backgroundColor: "#AAAAAA", paddingLeft: "2rem", paddingRight: "2rem", color: "white" }}>
                <Form onSubmit={handleEditSubmit} id="edituserform" style={{ marginTop: "20%" }}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input name="Name" id="name" placeholder="with a placeholder" onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="role">Role</Label>
                        <Input name="Role" id="role" placeholder="with a placeholder" onChange={handleChange} />
                    </FormGroup>

                    <Button type='submit' color="primary">Edit</Button>

                </Form>
            </div>
            <div id='AddUser' style={{ display: "none", position: "absolute", height: "55%", width: "33%", top: "22%", left: "33%", border: "2px solid black", backgroundColor: "#AAAAAA", paddingLeft: "2rem", paddingRight: "2rem", color: "white" }}>
                <Form onSubmit={handleAddSubmit} id="adduserform">
                    <FormGroup>
                        <Label for="imageurl">Image Url</Label>
                        <Input name="Url" id="imageurl" placeholder="with a placeholder" onChange={handleChangeAdd} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input name="Name" id="name" placeholder="with a placeholder" onChange={handleChangeAdd} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Email">Email</Label>
                        <Input type="email" name="Email" id="Email" placeholder="with a placeholder" onChange={handleChangeAdd} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="role">Role</Label>
                        <Input name="Role" id="role" placeholder="with a placeholder" onChange={handleChangeAdd} />
                    </FormGroup>

                    <Button type='submit' color="primary">ADD</Button>

                </Form>
            </div>
        </Box>
    );
}
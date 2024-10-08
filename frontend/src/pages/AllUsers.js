import React, { useEffect, useState,useContext } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit, MdDelete } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';
import Context from "../context/index";


const AllUsers = () => {
    const [allUser, setAllUsers] = useState([]);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const { authToken } = useContext(Context); // Get the authToken from Context

    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        _id: ""
    });

    const fetchAllUsers = async () => {
        const fetchData = await fetch(SummaryApi.allUser.url, {
            method: SummaryApi.allUser.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, 
              },
        });

        const dataResponse = await fetchData.json();

        if (dataResponse.success) {
            setAllUsers(dataResponse.data);
        }

        if (dataResponse.error) {
            toast.error(dataResponse.message);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const fetchResponse = await fetch(`/api/delete-user/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`, 
                      },
                });

                const responseData = await fetchResponse.json();

                if (responseData.success) {
                    toast.success('User deleted successfully');
                    fetchAllUsers(); // Refresh the user list after deletion
                } else {
                    toast.error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('An error occurred while deleting the user');
            }
        }
    };

    return (
        <div className='bg-white pb-4'>
            <table className='w-full userTable'>
                <thead>
                    <tr className='bg-black text-white'>
                        <th>Sr.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {allUser.map((el, index) => {
                        return (
                            <tr key={el._id}>
                                <td>{index + 1}</td>
                                <td>{el?.name}</td>
                                <td>{el?.email}</td>
                                <td>{el?.role}</td>
                                <td>{moment(el?.createdAt).format('LL')}</td>
                                <td>
                                    <button 
                                        className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white' 
                                        onClick={() => {
                                            setUpdateUserDetails(el);
                                            setOpenUpdateRole(true);
                                        }}
                                    >
                                        <MdModeEdit />
                                    </button>
                                    <button 
                                        className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white ml-2'
                                        onClick={() => deleteUser(el._id)}
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {openUpdateRole && (
                <ChangeUserRole 
                    onClose={() => setOpenUpdateRole(false)} 
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    );
};

export default AllUsers;

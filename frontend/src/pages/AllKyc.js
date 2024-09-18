import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import ChangeKycStatus from '../components/ChangeKyc';

const AllKyc = ({ setGlobalKycStatus }) => {
    const [kycData, setKycData] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [updateKycDetails, setUpdateKycDetails] = useState({
        _id: "",
        kycStatus: ""
    });

    // Fetch all KYC details for users who have submitted
    const fetchAllKyc = async () => {
        try {
            const response = await fetch(SummaryApi.getmyKYC.url);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setKycData(data.data); 
        } catch (error) {
            console.error('Error fetching KYC details:', error);
        }
    };

    useEffect(() => {
        fetchAllKyc();
    }, []);

    const handleStatusChangeClick = (kyc) => {
        setUpdateKycDetails(kyc);
        setOpenDropdown(true);
    };

    const updateGlobalKycStatus = (status) => {
        // Set globally or using context
        setGlobalKycStatus(status); 
    };

    return (
        <div className="p-4 bg-white">
            <h2 className="text-2xl font-bold mb-4">KYC List</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-black text-white">
                        <th className="py-2">Sr. No.</th>
                        <th className="py-2">Customer Name</th>
                        <th className="py-2">KYC Status</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {kycData.map((kyc, index) => (
                        <tr key={kyc._id} className="bg-white border border-gray-400">
                            <td className="py-4 text-center align-middle border-gray-400 font-semibold text-black">
                                {index + 1}
                            </td>
                            <td className="py-4 text-center align-middle border-gray-400 font-medium text-black">
                                {kyc.customerName || 'No name available'}
                            </td>
                            <td className="py-4 text-center align-middle border-gray-400 font-medium text-black">
                                {kyc.kycStatus || 'Pending'}
                            </td>
                            <td className="py-4 text-center align-middle border-gray-400">
                                <button
                                    className="bg-sky-600 text-white px-2 py-1 rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-opacity-50 transition duration-200"
                                    onClick={() => handleStatusChangeClick(kyc)}
                                >
                                    Change Status
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {openDropdown && (
                <ChangeKycStatus
                    onClose={() => setOpenDropdown(false)}
                    _id={updateKycDetails._id}
                    kycStatus={updateKycDetails.kycStatus}
                    callFunc={fetchAllKyc}
                    setGlobalKycStatus={updateGlobalKycStatus} // Pass the global setter function
                />
            )}
        </div>
    );
};

export default AllKyc;

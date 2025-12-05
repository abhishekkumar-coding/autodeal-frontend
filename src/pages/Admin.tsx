import React, { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
    _id: string;
    phone: string;
    documentUrl: string;
    status: "PENDING" | "VERIFIED" | "REJECTED";
    bookingType: string;
    carId: {
        brand: string;
        model: string;
    };
}

const Admin: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [dlImage, setDlImage] = useState<string | null>(null); // <-- FIX

    const fetchBookings = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get("http://localhost:3000/api/booking/allBookings");
            setBookings(res?.data?.bookings || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch bookings. Make sure your backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id: string, status: Booking["status"]) => {
        try {
            await axios.put(`http://localhost:3000/api/booking/${id}`, { status });
            setBookings((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status } : b))
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update status.");
        }
    };

    if (loading) return <p className="p-6">Loading bookings...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="border-b bg-gray-100">
                            <th className="px-4 py-2 text-left">Booking ID</th>
                            <th className="px-4 py-2 text-left">Phone</th>
                            <th className="px-4 py-2 text-left">DL Image</th>
                            <th className="px-4 py-2 text-left">Car Brand</th>
                            <th className="px-4 py-2 text-left">Car Model</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Action</th>
                            <th className="px-4 py-2 text-left">Booking Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="border-b">
                                <td className="px-4 py-2">{booking._id}</td>
                                <td className="px-4 py-2">{booking.phone}</td>

                                {/* CLICK IMAGE TO SHOW POPUP */}
                                <td className="px-4 py-2">
                                    {booking.documentUrl ? (
                                        <img
                                            src={booking.documentUrl}
                                            alt="DL"
                                            className="h-16 w-auto cursor-pointer"
                                            onClick={() => setDlImage(booking.documentUrl)}
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>

                                <td className="px-4 py-2">{booking.carId?.brand || "-"}</td>
                                <td className="px-4 py-2">{booking.carId?.model || "-"}</td>

                                <td className="px-4 py-2 capitalize">{booking.status}</td>

                                <td className="px-4 py-2">
                                    <select
                                        value={booking.status}
                                        onChange={(e) => updateStatus(booking._id, e.target.value as Booking["status"])}
                                        className="border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="VERIFIED">Verified</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </td>

                                <td className="px-4 py-2">{booking.bookingType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* POPUP IMAGE VIEWER */}
            {dlImage && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-96 h-96 rounded-md shadow-lg relative flex justify-center items-center">

                        {/* Close Button */}
                        <button
                            onClick={() => setDlImage(null)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
                        >
                            ✕
                        </button>

                        <img
                            src={dlImage}
                            alt="Large View"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;

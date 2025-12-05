import React, { useEffect, useState } from "react";
import axios from "axios";

// ------------------ TYPES ------------------
interface Car {
    _id: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    price: number;
    fuel: string;
    trans: string;
    mileage: number;
    image: string;
}

interface SelectedCar extends Car {
    type: "Buy" | "Rent";
}

const CarList: React.FC = () => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null);
    const [phone, setPhone] = useState<string>("");
    const [countryCode, setCountryCode] = useState<string>("+91");
    // const [loading, setLoading] = useState<boolean>(true);
    const [carsData, setCarsData] = useState<Car[]>([]);
    const [carId, setCarId] = useState<string>("")
    const [bookingType, setBookingType] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await axios.get("https://autodeal-backend.onrender.com/api/cars/allcars");
            console.log(res.data.cars)
            setCarsData(res.data?.cars);
            // setLoading(false);
        } catch (err) {
            console.error(err);
            alert(`Error: ${err || "Something went wrong"}`);
        } finally {
            setIsSubmitting(false);
        }

    };

    const handleOpenPopup = (car: Car, type: "Buy" | "Rent") => {
        setSelectedCar({ ...car, type });
        setCarId(car._id);
        setBookingType(type);
        setShowPopup(true);
    };


    const handleSubmit = async () => {
        if (!selectedCar || isSubmitting) return;
        setIsSubmitting(true);

        const fullPhone = countryCode + phone;

        try {
            await axios.post(
                "https://autodeal-backend.onrender.com/api/users/register",
                {
                    phone: fullPhone,
                    carId,
                    bookingType
                }
            );

            alert(`User registered successfully!`);

            setShowPopup(false);
            setPhone("");
            setCountryCode("+91");
        } catch (error: any) {
            console.error(error);
            alert(`Error: ${error.message || "Something went wrong"}`);
        }
    };

    return (
        <div className="p-6 w-full">
            <h1 className="text-center text-3xl font-bold mb-8 text-blue-700">
                AutoDeal Marketplace
            </h1>

            {/* Car Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {carsData.map((car) => (
                    <div
                        key={car._id}
                        className="bg-white shadow-md rounded-xl p-4 sm:px-8 border hover:shadow-xl transition flex justify-between items-center gap-4"
                    >

                        <img
                            src={car.image}
                            alt={car.model}
                            className="w-32 h-24 sm:w-42 sm:h-36 object-cover rounded-lg"
                        />

                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {car.brand} {car.model}
                            </h3>

                            <p className="text-gray-600"><b>Year:</b> {car.year}</p>
                            <p className="text-gray-600"><b>Color:</b> {car.color}</p>
                            <p className="text-gray-600"><b>Price:</b> ₹{car.price}</p>
                            <p className="text-gray-600"><b>Fuel:</b> {car.fuel}</p>
                            <p className="text-gray-600"><b>Trans:</b> {car.trans}</p>
                            <p className="text-gray-600"><b>Mileage:</b> {car.mileage} km</p>

                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={() => handleOpenPopup(car, "Buy")}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-sm"
                                >
                                    Buy
                                </button>

                                <button
                                    onClick={() => handleOpenPopup(car, "Rent")}
                                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition text-sm"
                                >
                                    Rent
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* POPUP */}
            {showPopup && selectedCar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                            Enter Phone Number
                        </h3>

                        <p className="text-gray-700 mb-3">
                            Car: <b>{selectedCar.brand} {selectedCar.model}</b> ({selectedCar.type})
                        </p>

                        <div className="flex gap-2 mb-4">
                            <select
                                className="border rounded-lg p-2 w-28 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                            >
                                <option value="+91">🇮🇳 +91</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+44">🇬🇧 +44</option>
                                <option value="+61">🇦🇺 +61</option>
                                <option value="+81">🇯🇵 +81</option>
                                <option value="+971">🇦🇪 +971</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-4 py-2 rounded-lg text-white transition 
        ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>


                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarList;

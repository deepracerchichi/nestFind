"use client"

import {useRouter} from "next/navigation";
import {useState} from "react";
import api from "@/lib/api";

export default function CreateListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        priceType: "per month",
        propertyType: "apartment",
        bedrooms: "1",
        bathrooms: "1",
        address: "",
        city: "",
        state: "",
        amenities: "",

    });

    const handleChange =  (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({...form, [e.target.name]: e.target.value });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Step 1: Upload Images first
            let imageUrls: string[] = [];
            if (imageFiles.length > 0) {
                const formData = new FormData();
                imageFiles.forEach((file) => formData.append("images", file));

                const uploadRes = await api.post("/api/upload", formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                });
                imageUrls = uploadRes.data.urls;
            }

            // Step 2: Create the listing with the image URLs
            await api.post("/api/listings", {
                ...form,
                price:     parseInt(form.price),
                bedrooms:  parseInt(form.bedrooms),
                bathrooms: parseInt(form.bathrooms),
                images:    imageUrls,
                amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
                location:  { address: form.address, city: form.city, state: form.state },
                });

            router.push("/admin")
        } catch (e) {
            console.error("Error creating form", e)
        } finally {
            setLoading(false)
        }

    }
    return (
        <form onSubmit={handleSubmit} className="relative py-32 overflow-hidden max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Create New Listing
            </h1>

            <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required={true}
                className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div>
                <input
                    name="price"
                    type="number"
                    placeholder="Price (&#8358;)"
                    value={form.price}
                    onChange={handleChange}
                    required={true}
                    className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select name="priceType" value={form.priceType} onChange={handleChange} className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>per month</option>
                    <option>per year</option>
                    <option>per night</option>
                </select>
            </div>

            <div>
                <select
                    name="propertyType"
                    value={form.propertyType}
                    onChange={handleChange}
                    className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="room">Room</option>
                    <option value="studio">Studio</option>
                    <option value="duplex">Duplex</option>
                </select>

                <input
                    name="bedrooms"
                    type="number"
                    placeholder="Bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                    className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    name="bathrooms"
                    type="number"
                    placeholder="Bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                    className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>

            <input
                name="address"
                placeholder="Street Address"
                value={form.address}
                onChange={handleChange}
                className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div>
                <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>

            <input
                name="amenities"
                placeholder="Amenities"
                value={form.amenities}
                onChange={handleChange}
                className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div>
                <label>
                    Property Images
                </label>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files || [])) }
                    className=" text-black w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {imageFiles.length > 0 && (
                    <p>
                        {imageFiles.length} file(s) selected
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className=" text-black w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {loading ? "Creating..." : "Create Listing"}
            </button>
        </form>
    )
}
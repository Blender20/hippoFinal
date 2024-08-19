import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from "firebase/firestore";
import { AiOutlineClose } from 'react-icons/ai';
import { db } from '../lib/firebase';
import { ClipLoader } from 'react-spinners';
import { store } from '../lib/store';
import toast from 'react-hot-toast';

interface ArtModelProps {
    handleClose: () => void;
}

const ArtModel: React.FC<ArtModelProps> = ({ handleClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedImages, setUploadedImages] = useState<{ id: string, url: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const currentUser = store((state) => state.currentUser);

    useEffect(() => {
        const fetchImages = async () => {
            if (currentUser) {
                const q = query(collection(db, 'artimages'), where('userId', '==', currentUser.id));
                const querySnapshot = await getDocs(q);
                const images = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    url: doc.data().url
                }));
                setUploadedImages(images);
                // Save to local storage
                localStorage.setItem("artimages", JSON.stringify(images));
            }
        };
        fetchImages();
    }, [currentUser]);

    const handleUpload = async () => {
        try {
            if (selectedFile && currentUser) {
                setLoading(true);
                const storage = getStorage();
                const storageRef = ref(storage, `artimages/${currentUser.id}/${selectedFile.name}`);
                await uploadBytes(storageRef, selectedFile);
                const downloadURL = await getDownloadURL(storageRef);

                await addDoc(collection(db, 'artimages'), {
                    userId: currentUser.id,
                    url: downloadURL,
                });

                const newImage = { id: storageRef.name, url: downloadURL };
                setUploadedImages(prev => [...prev, newImage]);
                // Save to local storage
                const updatedImages = [...uploadedImages, newImage];
                localStorage.setItem("artimages", JSON.stringify(updatedImages));

                setSelectedFile(null);
                toast.success("Image uploaded successfully");
            }
        } catch (error) {
            toast.error("Failed to upload image. Please try again.");
            console.error("Upload error: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, url: string) => {
        try {
            if (currentUser) {
                const storage = getStorage();
                const storageRef = ref(storage, url);

                await deleteObject(storageRef);
                const imageDocRef = doc(db, 'artimages', id);
                await deleteDoc(imageDocRef);

                const updatedImages = uploadedImages.filter(image => image.id !== id);
                setUploadedImages(updatedImages);
                // Update local storage
                localStorage.setItem("artimages", JSON.stringify(updatedImages));

                toast.success("Image deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete image. Please try again.");
            console.error("Delete error: ", error);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-96 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                    <AiOutlineClose size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Upload Artwork</h2>
                <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                <button
                    onClick={handleUpload}
                    className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:bg-gray-300"
                    disabled={!selectedFile || loading}
                >
                    {loading ? <ClipLoader size={20} color={"#fff"} /> : "Upload"}
                </button>
                <div className="mt-4">
                    {uploadedImages.map(image => (
                        <div key={image.id} className="relative mb-4">
                            <img src={image.url} alt="Uploaded Artwork" className="w-full h-48 object-cover rounded-lg" />
                            <button
                                onClick={() => handleDelete(image.id, image.url)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <AiOutlineClose size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArtModel;

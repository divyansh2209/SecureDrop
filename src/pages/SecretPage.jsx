import React, { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, storage } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteObject, ref } from 'firebase/storage';

const SecretPage = () => {
    let { id } = useParams();
    const [secret, setSecret] = useState('');
    const [showSecret, setShowSecret] = useState(false);
    const [imageId, setImageId] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [password, setPassword] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const textDocRef = doc(db, "texts", id);
            const imageDocRef = doc(db, "images", id);

            const textDocSnap = await getDoc(textDocRef);
            const imageDocSnap = await getDoc(imageDocRef);


            if (textDocSnap.exists()) {
                const data = textDocSnap.data();
                if (data.password) {
                    setPasswordRequired(true);
                    setPassword(data.password);
                }
                setSecret(data.message);
            } else if (imageDocSnap.exists()) {
                const data = imageDocSnap.data();
                if (data.password) {
                    setPasswordRequired(true);
                    setPassword(data.password);
                }
                setImageUrl(data.imageUrl);
            } else {
                navigate('/notfound');
            }

        };

        fetchData();
    }, [id]);

    const handleShowSecret = async () => {
        if (passwordRequired && enteredPassword !== password) {
            alert("Incorrect password. Please try again.");
            return;
        }

        try {
            await deleteDoc(doc(db, "texts", id));
            await deleteDoc(doc(db, "images", id));
            setShowSecret(true);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const handleDelete = async () => {
        setSecret('');
        setImageUrl('');
        navigate('/');
    };

    const handleDeleteImage = async () => {
        const imageRef = ref(storage, `images/${id}`);
        deleteObject(imageRef).then(() => {
            // File deleted successfully
            navigate('/');
        }).catch((error) => {
            // Uh-oh, an error occurred!
            console.error(error)
        });
    }

    return (
        <div className='bg-[#001d3d] h-screen w-screen flex flex-col  items-center'>
            <div className='pt-10 mb-10 flex flex-col justify-center items-center'>
                <h1 class=" mb-3 font-extrabold leading-tight text-white text-center text-7xl sm:text-8xl">
                    Incoming...
                </h1>
                {/* <p className=' font-extrabold leading-tight text-xl text-white'>Discover Secrecy Unveiled:</p */}
                <p className='font-extrabold leading-tight text-2xl text-red-500'>You have a new secret</p>
            </div>

            <div className="bg-[#212529] text-white font-semibold text-xl px-8 py-5 rounded-lg">
                {secret || imageUrl ? (
                    showSecret ? (
                        <div className="flex flex-col items-center justify-center">
                            {secret && <p className='text-red-500'>Message: {secret}</p>}
                            {imageUrl && <img src={imageUrl} alt="Uploaded" />}
                            {secret && <button
                                onClick={handleDelete}
                                className="mt-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Delete Secret
                            </button>}
                            {imageUrl && <button
                                onClick={handleDeleteImage}
                                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Delete Secret
                            </button>}
                        </div>
                    ) : (
                        <div>
                            <div>
                                <p>Hey! You received a secret.</p>
                            </div>
                            {passwordRequired && (
                                <div className='mb-5'>
                                    <label className='block text-white mb-2'>Enter Password:</label>
                                    <input
                                        type='password'
                                        value={enteredPassword}
                                        onChange={(e) => setEnteredPassword(e.target.value)}
                                        className='p-2 rounded-lg bg-[#e5e5e5] text-black focus:outline-none focus:ring focus:border-indigo-500'
                                    />
                                </div>
                            )}
                            <div className='flex'>
                                <div className='mr-5 text-red-500'>
                                    You can only view this secret one time.
                                </div>
                                <div>
                                    <button
                                        onClick={handleShowSecret}
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Show Secret
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                ) :(
                    <button type="button" class="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                        <svg width="20" height="20" fill="currentColor" class="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                            <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                            </path>
                        </svg>
                        loading
                    </button>
                )}
            </div>

        </div>
    );
}

export default SecretPage;

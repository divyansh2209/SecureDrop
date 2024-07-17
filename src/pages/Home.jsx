import React, { useState } from 'react'
import Form from '../components/Form'
import Image_form from '../components/Image_form';

const Home = () => {
    const [textContainer, setTextContainer] = useState(true);
    const [imageContainer, setImageContainer] = useState(false);
    const [activeTab, setActiveTab] = useState('text');

    const handleTextClick = () => {
        setActiveTab('text');
        setTextContainer(true);
        setImageContainer(false);
    }

    const handleImageClick = () => {
        setActiveTab('image');
        setTextContainer(false);
        setImageContainer(true);
    }

    return (
        <div className='bg-[#001d3d] h-screen w-screen flex  items-center flex-col'>
            <div className='mb-10 flex flex-col justify-center items-center'>
                <h1 class="mt-10 mb-3 font-extrabold leading-tight text-white text-center text-7xl sm:text-8xl">
                    Generate Secret
                </h1>
                <p className=' font-extrabold leading-tight text-xl text-white'>Discover Secrecy Unveiled:</p>
                <p className='font-extrabold leading-tight text-xl text-red-500'>Texts and Images Safely Stored</p>
            </div>
            <div className='w-6/12 bg-[#364156]'>

                <div className=''>
                    <div className='bg-red-500 flex items-center justify-center rounded-t-xl'>
                        <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500">
                            <li onClick={handleTextClick} class="mr-2">
                                <p class={` text-lg font-bold cursor-pointer inline-block p-4 text-gray-800  active  ${activeTab === 'text' ? 'bg-white text-black' : ''}`}>
                                    Text
                                </p>
                            </li>
                            <li onClick={handleImageClick} class="mr-2">
                                <p className={`text-lg font-bold cursor-pointer inline-block p-4  text-gray-800 hover:bg-gray-50 ${activeTab === 'image' ? 'bg-white text-black' : ''}`}>
                                    Image
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className=''>
                        {
                            textContainer && <Form />
                        }
                        {
                            imageContainer && <Image_form />
                        }
                    </div>
                </div>


            </div>
        </div >
    )
}

export default Home
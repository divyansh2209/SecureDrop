// import { Button } from '@material-tailwind/react'
import React from 'react'

const Secret_container = () => {
    return (
        <div className=''>
            <div>
                <p>Hey! You received a secret. </p>
            </div>
            <div className='flex'>
                <div className='mr-5'>
                    You can only view this secret one time.
                </div>
                <div>
                    <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Show Secret
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Secret_container
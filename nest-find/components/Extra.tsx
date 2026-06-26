import { PlusIcon } from 'lucide-react'
import React from 'react'

const Extra = () => {
  return (
    <section className='bg-foreground flex justify-center items-center mx-auto text-center p-20'>
        <div className='bg-primary px-28 md:grid md:grid-cols-1 rounded-2xl flex gap-3 items-center'>

            <div className='flex '>
                <div className='text-white text-4xl'>
                    List your Property for Free Today
                </div>
            </div>

            <div className='p-2 bg-background rounded-xl justify-center'>
                <button className='flex items-center justify-center'>
                    <PlusIcon />
                    Get Started as Owner
                </button>
            </div>
        </div>
    </section>
  )
}

export default Extra
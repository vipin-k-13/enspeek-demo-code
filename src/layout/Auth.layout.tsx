import { Outlet } from 'react-router'
import Background from '../components/common/Auth/Background'
import { ColoredLogo } from '../assets/icons'

const Auth_layout = () => {
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-white p-2'>
        <div className='absolute top-0 left-2'>
            <img src={ColoredLogo} alt='Insights Curry' className='w-[70%]'/>
        </div>
        <div className='flex w-full h-full items-center justify-center'>
            <div className='w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-md border border-gray-200'>
                <Background/>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Auth_layout
/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import Button from '../Shared/Button/Button'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const PurchaseModal = ({ closeModal, isOpen, plant, refetch }) => {
  const { _id, name, category, price, quantity, seller } = plant || {}

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const [totalQuantity, setTotalQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(price)
  const [purchaseInfo, setPurchaseInfo] = useState({
    customer: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    plantId: _id,
    price: totalPrice,
    quantity: totalQuantity,
    seller: seller?.email,
    status: 'pending',
  })

  const handleQuantity = value => {

    if (value > quantity) {
      setTotalQuantity(quantity)
      return toast.error('Quantity exceeds available stock!!')
    }
    if (value < 0) {
      setTotalQuantity(1)
      return toast.error('Quantity cannot be less then 1')
    }

    setTotalQuantity(value)
    setTotalPrice(value * price)
    setPurchaseInfo(prev => {
      return { ...prev, quantity: value, price: value * price }
    })


  }

  const handlePurchase = async () => {
    console.table(purchaseInfo);
    // set purchase details in DB
    try {
      await axiosSecure.post('/orders', purchaseInfo)
      await axiosSecure.patch(`/plants/quantity/${_id}`, { quantityToUpdate: totalQuantity })
      toast.success('Order Placed!!')
      refetch();

      // clear the input field 
      // Reset modal states
      setTotalQuantity(1)
      setTotalPrice(price)
      setPurchaseInfo(prev => ({
        ...prev,
        quantity: 1,
        price: price,
        address: '',
      }))
    } catch (err) {
      console.log(err);
    } finally {
      closeModal();
    }

  }


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all '>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Review Info Before Purchase
                </DialogTitle>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Plant: {name}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Category: {category}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Customer: {user?.displayName}</p>
                </div>

                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Price: $ {price}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Available Quantity: {quantity}</p>
                </div>
                {/* Quantity */}
                <div className='space-y-1 text-sm flex items-center gap-2'>
                  <label htmlFor='quantity' className='block text-gray-600 text-xl'>
                    Quantity:
                  </label>
                  <input
                    className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    name='quantity'
                    value={totalQuantity}
                    onChange={(e) => handleQuantity(parseInt(e.target.value))}
                    id='quantity'
                    type='number'
                    placeholder='Available quantity'
                    required
                    step={'any'}
                  />
                </div>
                {/* Name */}
                <div className='space-y-1 text-sm flex items-center gap-2 my-3'>
                  <label htmlFor='name' className='block text-gray-600 text-xl'>
                    Address:
                  </label>
                  <input
                    className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    onChange={(e) => setPurchaseInfo(prev => {
                      return { ...prev, address: e.target.value }
                    })}
                    name='name'
                    id='name'
                    type='text'
                    placeholder='Your Address'
                    required
                  />
                </div>
                <Button
                  onClick={handlePurchase}
                  label={`Pay ${totalPrice}$`} />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition >
  )
}

export default PurchaseModal

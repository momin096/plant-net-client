import Container from '../../components/Shared/Container'
import { Helmet } from 'react-helmet-async'
import Heading from '../../components/Shared/Heading'
import Button from '../../components/Shared/Button/Button'
import PurchaseModal from '../../components/Modal/PurchaseModal'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'
import useAuth from '../../hooks/useAuth.js'


const PlantDetails = () => {
  let [isOpen, setIsOpen] = useState(false)
  const { id } = useParams();
  const {user} = useAuth();

  const { data: plant = [], isLoading, refetch } = useQuery({
    queryKey: ['plant', id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/plant/${id}`)
      return res.data
    }
  })

  const { _id, name, category, description, price, quantity, imageUrl, seller } = plant || {}

  const closeModal = () => {
    setIsOpen(false)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Container>
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <div className='mx-auto flex flex-col lg:flex-row justify-between w-full gap-12'>
        {/* Header */}
        <div className='flex flex-col gap-6 flex-1'>
          <div>
            <div className='w-full overflow-hidden rounded-xl'>
              <img
                className='object-cover w-full lg:max-h-screen'
                src={imageUrl}
                alt={name}
              />
            </div>
          </div>
        </div>
        <div className='md:gap-10 flex-1'>
          {/* Plant Info */}
          <Heading
            title={name}
            subtitle={`Category: ${category}`}
          />
          <hr className='my-6' />
          <div
            className='
          text-lg font-light text-neutral-500'
          >
            {description}
          </div>
          <hr className='my-6' />

          <div
            className='
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              '
          >
            <div>Seller: {seller.name}</div>

            <img
              className='rounded-full'
              height='30'
              width='30'
              alt='Avatar'
              referrerPolicy='no-referrer'
              src={seller.image}
            />
          </div>
          <hr className='my-6' />
          <div>
            <p
              className='
                gap-4 
                font-light
                text-neutral-500
              '
            >
              Quantity: {quantity > 0 ? `${quantity} 'Units Left Only!` : 'Out Of Stock'}
            </p>
          </div>
          <hr className='my-6' />
          <div className='flex justify-between'>
            <p className='font-bold text-3xl text-gray-500'>Price: {price}$</p>
            <div>
              <Button disabled={user?.email === seller?.email} onClick={() => setIsOpen(true)} label={quantity > 0 ? 'Purchase' : 'Out Of Stock'} />
            </div>
          </div>
          <hr className='my-6' />

        <PurchaseModal plant={plant} refetch={refetch} closeModal={closeModal} isOpen={isOpen} />
        </div>
      </div>
    </Container>
  )
}

export default PlantDetails

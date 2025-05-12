import { useState } from 'react'
import UpdateUserModal from '../../Modal/UpdateUserModal'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
const UserDataRow = ({ user, refetch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { email, role, status, name } = user || {};
  const axiosSecure = useAxiosSecure();
  // handle user role update 
  const updateRole = async (selectedRole) => {
    if (role === selectedRole) return toast.error('Your Select The Previous Role')

    try {
      const { data } = await axiosSecure.patch(`/users/role/${email}`, { role: selectedRole })
      if (data?.modifiedCount > 0) {
        refetch()
        setIsOpen(false)
        toast.success(`${name}'s Role Update ${selectedRole} To ${role}`)
      }
    } catch (err) {
      toast.error(err?.response?.data)
    }

  }


  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{email}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{role}</p>
      </td>
      <td className={` px-5 py-5 border-b border-gray-200 bg-white text-sm `}>
        <p className={`${status === 'Requested' ? 'text-yellow-500' : status === 'Verified' ? 'text-green-500' : !status ? 'text-red-500' : ''} whitespace-no-wrap`}>
          {status || 'Unverified'}
        </p>

      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={() => setIsOpen(true)}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Update Role</span>
        </span>
        {/* Modal */}
        <UpdateUserModal
          role={role}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          updateRole={updateRole}
        />
      </td>
    </tr >
  )
}

UserDataRow.propTypes = {
  user: PropTypes.object,
  refetch: PropTypes.func,
}

export default UserDataRow

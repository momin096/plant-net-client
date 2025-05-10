import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../api/utils';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AddPlant = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [uploadButtonText, setUploadButtonText] = useState('Upload');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value
    const description = form.description.value;
    const category = form.category.value
    const price = parseFloat(form.price.value)
    const quantity = parseInt(form.quantity.value);

    const image = form.image.files[0]

    const imageUrl = await imageUpload(image)

    const seller = {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    }

    const plantData = {
      name,
      category,
      description,
      price,
      quantity,
      imageUrl,
      seller,
    }

    try {
      const { data } = await axiosSecure.post('/plants', plantData)
      if (data.insertedId) {
        toast.success('Plant Added!!')
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }


  }

  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm handleSubmit={handleSubmit} uploadButtonText={uploadButtonText} setUploadButtonText={setUploadButtonText} loading={loading} />
    </div>
  )
}

export default AddPlant

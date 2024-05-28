import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, get } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMedicalRecord = () => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedVet, setSelectedVet] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPets();
    fetchVets();
  }, []);

  const fetchPets = async () => {
    const db = getDatabase();
    const petsRef = ref(db, 'pets');
    const snapshot = await get(petsRef);
    if (snapshot.exists()) {
      const petsData = snapshot.val();
      const petsList = Object.keys(petsData).map(key => ({ id: key, ...petsData[key] }));
      setPets(petsList);
    }
  };

  const fetchVets = async () => {
    const db = getDatabase();
    const vetsRef = ref(db, 'veterinarians');
    const snapshot = await get(vetsRef);
    if (snapshot.exists()) {
      const vetsData = snapshot.val();
      const vetsList = Object.keys(vetsData).map(key => ({ id: key, ...vetsData[key] }));
      setVets(vetsList);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getDatabase();
      const newRecordRef = push(ref(db, 'medicalRecords'));
      set(newRecordRef, {
        description,
        date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        petID: selectedPet,
        vetID: selectedVet,
      });
      toast.success('Medical record added successfully.');
      setDescription("");
      setDate("");
      setSelectedPet("");
      setSelectedVet("");
    } catch (error) {
      toast.error('Error adding medical record: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-container">
      <div className="container" id="container">
        <h3 className="account-title">Add Medical Record</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='des'>Description</label>
            <textarea
              required
              value={description}
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className='date'>Date</label>
            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className='pet'>Pet</label>
            <select
              required
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="form-input"
            >
              <option value="">Select Pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>{pet.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className='vet'>Veterinarian</label>
            <select
              required
              value={selectedVet}
              onChange={(e) => setSelectedVet(e.target.value)}
              className="form-input"
            >
              <option value="">Select Veterinarian</option>
              {vets.map((vet) => (
                <option key={vet.id} value={vet.id}>{vet.fullName}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Adding...' : 'Add Medical Record'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddMedicalRecord;

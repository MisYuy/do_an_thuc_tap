import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_MaterialUsageSection = () => {
    const [materials, setMaterials] = useState([]);
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [quantityUsed, setQuantityUsed] = useState('');
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get(`${URL}/api/material/get-all`);
                setMaterials(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchMaterials();
    }, []);

    const validateInputs = () => {
        const errors = {};
        if (!selectedMaterialId) errors.selectedMaterialId = 'Material is required';
        if (!quantityUsed) {
            errors.quantityUsed = 'Quantity used is required';
        } else if (quantityUsed < 0) {
            errors.quantityUsed = 'Quantity used must be greater than or equal to 0';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            const response = await axios.post(`${URL}/api/material/usage`, {
                material_id: selectedMaterialId,
                quantity_used: quantityUsed
            });
            navigate('/m/material');
            console.log('Material usage recorded successfully:', response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(error.response ? error.response.data : 'Error recording material usage');
        }
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong>Form ghi nhận sử dụng vật liệu</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="material" className="form-control-label">Vật liệu</label></div>
                                        <div className="col-12 col-md-9">
                                            <select
                                                id="material"
                                                name="material"
                                                className="form-control"
                                                value={selectedMaterialId}
                                                onChange={(e) => setSelectedMaterialId(e.target.value)}
                                            >
                                                <option value="">Chọn vật liệu</option>
                                                {materials.map(material => (
                                                    <option key={material.material_id} value={material.material_id}>
                                                        {material.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {validationErrors.selectedMaterialId && <div className="text-danger">{validationErrors.selectedMaterialId}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="quantityUsed" className="form-control-label">Số lượng sử dụng</label></div>
                                        <div className="col-12 col-md-9">
                                            <input
                                                type="number"
                                                id="quantityUsed"
                                                name="quantityUsed"
                                                placeholder="Enter quantity used"
                                                className="form-control"
                                                value={quantityUsed}
                                                onChange={(e) => setQuantityUsed(e.target.value)}
                                            />
                                            <small className="help-block form-text">Please enter the quantity used</small>
                                            {validationErrors.quantityUsed && <div className="text-danger">{validationErrors.quantityUsed}</div>}
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger">
                                            {typeof error === 'string' ? error : JSON.stringify(error)}
                                        </div>
                                    )}
                                    <div className="card-footer" style={{ textAlign: 'center' }}>
                                        <input className="btn btn-success" type="submit" value="Xác nhận" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default M_MaterialUsageSection;

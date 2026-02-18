import { TICKET_CATEGORIES } from '../../config/constants';
import useTickets from '../../Hooks/useTickets';
import { useToast } from '../../Context/ToastContext';
import type { TicketCreate } from '../../Types/ticket.types';
import ScaleLoader from '../Common/loader';
import { useState, useRef } from 'react';

interface CreateNewTicketProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CreateNewTicket: React.FC<CreateNewTicketProps> = ({ onClose, onSuccess }) => {
    const { createTicket } = useTickets(false); // Don't auto-fetch here
    const { showToast } = useToast();
    const [formData, setFormData] = useState<TicketCreate>({
        title: '',
        description: '',
        category: 'Other',
        tags: [],
        image: ''
    });
    const [tagInput, setTagInput] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size must be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, image: base64String }));
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title || !formData.description) {
            setError('Title and description are required');
            return;
        }

        try {
            setLocalLoading(true);
            const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            const newTicket = await createTicket({ ...formData, tags });

            if (newTicket) {
                showToast('Ticket created successfully!', 'success');
                onSuccess();
                onClose();
            } else {
                setError('Failed to create ticket. Please try again.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create ticket');
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Ticket</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form className="create-ticket-form" onSubmit={handleSubmit}>
                    {error && <div className="form-error">❌ {error}</div>}

                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Brief title of the issue"
                            required
                        />
                    </div>

                    <div className="form-group row">
                        <div className="form-subgroup">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                {TICKET_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-subgroup">
                            <label htmlFor="tags">Tags (comma separated)</label>
                            <input
                                type="text"
                                id="tags"
                                value={tagInput}
                                onChange={handleTagChange}
                                placeholder="ai, react, help"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Detailed explanation of what you need help with..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Attachment (Image)</label>
                        <div className="image-upload-wrapper" onClick={() => fileInputRef.current?.click()}>
                            {imagePreview ? (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <div className="image-overlay">Click to change</div>
                                </div>
                            ) : (
                                <div className="image-placeholder">
                                    <span className="upload-icon">📁</span>
                                    <span>Click to upload image (max 2MB)</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={localLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={localLoading}>
                            {localLoading ? (
                                <ScaleLoader loading={true} color="#ffffff" height={20} width={3} />
                            ) : (
                                'Create Ticket'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNewTicket;
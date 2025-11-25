


import React, { useState, useEffect, useRef } from 'react';
import { Activity, ActivityType } from '../types';
import { Navigation, Clock, ShoppingBag, Utensils, Car, MapPin, Edit2, Check, X, MessageSquare, Store, Image as ImageIcon, Trash2, Ticket } from 'lucide-react';

interface ItineraryCardProps {
  activity: Activity;
}

const getIcon = (type: ActivityType) => {
  switch (type) {
    case 'food': return <Utensils size={18} />;
    case 'transport': return <Car size={18} />;
    case 'buy': return <ShoppingBag size={18} />;
    case 'info': return <Ticket size={18} />;
    case 'spot': default: return <MapPin size={18} />;
  }
};

const ItineraryCard: React.FC<ItineraryCardProps> = ({ activity }) => {
  const icon = getIcon(activity.type);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for editable fields
  const [title, setTitle] = useState(activity.title);
  const [time, setTime] = useState(activity.time);
  const [openingHours, setOpeningHours] = useState(activity.openingHours || '');
  const [description, setDescription] = useState(activity.description);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Temp state for editing
  const [editedTitle, setEditedTitle] = useState(activity.title);
  const [editedTime, setEditedTime] = useState(activity.time);
  const [editedOpeningHours, setEditedOpeningHours] = useState(activity.openingHours || '');
  const [editedDesc, setEditedDesc] = useState(activity.description);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedTitle = localStorage.getItem(`title_${activity.id}`);
    const savedTime = localStorage.getItem(`time_${activity.id}`);
    const savedOpening = localStorage.getItem(`opening_${activity.id}`);
    const savedDesc = localStorage.getItem(`desc_${activity.id}`);
    const savedComment = localStorage.getItem(`comment_${activity.id}`);
    const savedImages = localStorage.getItem(`images_${activity.id}`);

    if (savedTitle) { setTitle(savedTitle); setEditedTitle(savedTitle); }
    if (savedTime) { setTime(savedTime); setEditedTime(savedTime); }
    if (savedOpening) { setOpeningHours(savedOpening); setEditedOpeningHours(savedOpening); }
    if (savedDesc) { setDescription(savedDesc); setEditedDesc(savedDesc); }
    if (savedComment) { setComment(savedComment); }
    if (savedImages) { setImages(JSON.parse(savedImages)); }
  }, [activity.id]);

  const handleSave = () => {
    localStorage.setItem(`title_${activity.id}`, editedTitle);
    localStorage.setItem(`time_${activity.id}`, editedTime);
    localStorage.setItem(`opening_${activity.id}`, editedOpeningHours);
    localStorage.setItem(`desc_${activity.id}`, editedDesc);
    
    setTitle(editedTitle);
    setTime(editedTime);
    setOpeningHours(editedOpeningHours);
    setDescription(editedDesc);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedTime(time);
    setEditedOpeningHours(openingHours);
    setEditedDesc(description);
    setIsEditing(false);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    localStorage.setItem(`comment_${activity.id}`, newComment);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Limit to 3 images to prevent localStorage overflow
        const newImages = [...images, base64].slice(-3);
        setImages(newImages);
        localStorage.setItem(`images_${activity.id}`, JSON.stringify(newImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    localStorage.setItem(`images_${activity.id}`, JSON.stringify(newImages));
  };

  return (
    <div className={`group relative bg-white hover:bg-notion-hover rounded-md mb-6 border transition-all duration-200 ${activity.highlight ? 'border-[#37352F] shadow-sm' : 'border-notion-border'}`}>
      
      <div className="p-4">
        {/* Header: Icon + Title + Time (Editable) */}
        <div className="flex items-start space-x-3 mb-2">
          <div className="flex-shrink-0 pt-0.5 select-none text-notion-gray">
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3 mb-2 animate-fade-in bg-notion-gray-bg/20 p-3 rounded-md border border-notion-border">
                <div>
                   <label className="text-xs text-notion-gray font-bold uppercase block mb-1">標題 (Title)</label>
                   <input 
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full text-base font-semibold text-notion-text border border-notion-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-notion-gray bg-white"
                   />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                     <label className="text-xs text-notion-gray font-bold uppercase block mb-1">預計時間 (Plan)</label>
                     <input 
                      type="text"
                      value={editedTime}
                      onChange={(e) => setEditedTime(e.target.value)}
                      className="w-full text-xs font-mono text-notion-gray border border-notion-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-notion-gray bg-white"
                     />
                  </div>
                  <div>
                     <label className="text-xs text-notion-gray font-bold uppercase block mb-1">營業時間 (Open)</label>
                     <input 
                      type="text"
                      value={editedOpeningHours}
                      placeholder="e.g. 09:00 - 22:00"
                      onChange={(e) => setEditedOpeningHours(e.target.value)}
                      className="w-full text-xs font-mono text-notion-gray border border-notion-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-notion-gray bg-white"
                     />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-base font-semibold text-notion-text leading-tight">
                  {title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 mt-1">
                  <div className="flex items-center text-notion-gray text-xs font-medium font-mono">
                    <Clock size={12} className="mr-1.5" />
                    {time}
                  </div>
                  {openingHours && (
                    <div className="flex items-center text-notion-gray text-xs font-medium">
                      <Store size={12} className="mr-1.5" />
                      {openingHours}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description (Editable) */}
        <div className="ml-8 mb-3 relative">
          {isEditing ? (
            <div className="mt-1 animate-fade-in">
              <label className="text-xs text-notion-gray font-bold uppercase mb-1 block">說明 (Description)</label>
              <textarea 
                className="w-full text-sm text-notion-text border border-notion-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-notion-gray bg-white"
                rows={3}
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-3 border-t border-notion-border pt-3">
                <button 
                  onClick={handleCancel}
                  className="flex items-center text-xs text-notion-gray hover:text-notion-text px-3 py-1.5 rounded hover:bg-notion-gray-bg transition-colors"
                >
                  <X size={12} className="mr-1" /> 取消
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center text-xs text-white bg-notion-text hover:bg-black px-3 py-1.5 rounded transition-colors"
                >
                  <Check size={12} className="mr-1" /> 儲存變更
                </button>
              </div>
            </div>
          ) : (
            <div className="group/desc relative pr-6">
              <p className="text-sm text-notion-text/80 leading-6 whitespace-pre-line">
                {description}
              </p>
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -top-1 right-0 opacity-0 group-hover/desc:opacity-100 transition-opacity text-notion-gray hover:text-notion-text p-1.5 rounded-full hover:bg-notion-gray-bg"
                title="編輯內容"
              >
                <Edit2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Souvenirs / Recommendations */}
        {!isEditing && activity.souvenirs && activity.souvenirs.length > 0 && (
          <div className="ml-8 mt-3 mb-3 p-3 bg-notion-gray-bg/30 rounded-md border border-notion-border border-dashed">
            <div className="flex items-center text-xs font-bold text-notion-gray mb-2 uppercase tracking-wider">
              <ShoppingBag size={12} className="mr-1.5" />
              推薦買物
            </div>
            <ul className="space-y-1">
              {activity.souvenirs.map((item, idx) => (
                <li key={idx} className="text-xs text-notion-text flex items-start">
                  <span className="mr-2 text-notion-gray">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer: Tags & Action */}
        {!isEditing && (
          <div className="ml-8 flex flex-wrap items-center gap-2 mt-3">
            {activity.tags?.map((tag, idx) => {
              let tagClass = 'bg-notion-gray-bg text-notion-text border border-notion-border';
              if (tag.type === 'food') tagClass = 'bg-[#F9F5F1] text-[#5F5E5B] border border-[#EBE6E0]';
              if (tag.type === 'buy') tagClass = 'bg-[#F1F6F8] text-[#4A5D66] border border-[#E3EAED]';
              if (tag.type === 'tip') tagClass = 'bg-[#F6F4F9] text-[#5C5364] border border-[#ECEAF0]';
              if (tag.type === 'alert') tagClass = 'bg-[#FEF4F3] text-[#7A4C4A] border border-[#FBEAE9]';
              if (tag.type === 'card') tagClass = 'bg-[#37352F] text-white border border-[#37352F]'; // Manhole Card
              
              return (
                <span key={idx} className={`px-2 py-0.5 rounded text-[11px] font-medium ${tagClass}`}>
                  {tag.label}
                </span>
              );
            })}
            
            {activity.locationUrl && (
              <a 
                href={activity.locationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-auto flex items-center text-xs text-notion-gray hover:text-notion-text hover:underline transition-colors"
              >
                <Navigation size={12} className="mr-1" />
                開啟地圖
              </a>
            )}
          </div>
        )}
        
        {/* Post-Visit Comments & Photos Section */}
        {!isEditing && (
          <div className="ml-8 mt-4 pt-4 border-t border-notion-border">
            <div className="flex flex-col space-y-3">
               
               {/* Comment Input */}
               <div className="flex items-start">
                  <MessageSquare size={12} className="mt-1 mr-2 text-notion-gray" />
                  <div className="flex-1">
                    <textarea
                        placeholder="旅途筆記 / 心得記錄..."
                        value={comment}
                        onChange={handleCommentChange}
                        className="w-full text-xs text-notion-text bg-transparent border-none p-0 focus:ring-0 placeholder:text-notion-gray/50 resize-none"
                        rows={comment ? 3 : 1}
                    />
                  </div>
               </div>

               {/* Photo List */}
               {images.length > 0 && (
                 <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group/img flex-shrink-0">
                        <img src={img} alt="User upload" className="h-16 w-16 object-cover rounded border border-notion-border" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute -top-1 -right-1 bg-white text-notion-text rounded-full p-0.5 shadow-sm border border-notion-border opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                 </div>
               )}

               {/* Photo Upload Button */}
               <div className="flex justify-start">
                 <input 
                   type="file" 
                   accept="image/*" 
                   ref={fileInputRef} 
                   onChange={handleImageUpload} 
                   className="hidden" 
                 />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="text-[10px] flex items-center text-notion-gray hover:text-notion-text transition-colors"
                 >
                   <ImageIcon size={10} className="mr-1" />
                   新增照片 {images.length}/3
                 </button>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ItineraryCard;
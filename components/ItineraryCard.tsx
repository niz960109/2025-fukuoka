import React, { useState, useEffect, useRef } from 'react';
import { Activity, ActivityType } from '../types';
import { Navigation, Clock, ShoppingBag, Utensils, Car, MapPin, Edit2, Check, X, MessageSquare, Store, Image as ImageIcon, Trash2, Ticket, Star, AlertCircle, Info, Landmark } from 'lucide-react';

interface ItineraryCardProps {
  activity: Activity;
}

// Unified Monochrome Style
const getIcon = (type: ActivityType) => {
  switch (type) {
    case 'food': return <Utensils size={20} />;
    case 'transport': return <Car size={20} />;
    case 'buy': return <ShoppingBag size={20} />;
    case 'info': return <Ticket size={20} />;
    case 'spot': default: return <MapPin size={20} />;
  }
};

const ItineraryCard: React.FC<ItineraryCardProps> = ({ activity }) => {
  // Common styles for all cards (Monochrome)
  const containerClass = "bg-white border border-notion-border rounded-xl mb-4 transition-all shadow-sm hover:shadow-md";
  const iconBoxClass = "text-notion-text bg-notion-gray-bg p-2 rounded-md";

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
    <div className={`group relative ${containerClass}`}>
      
      <div className="p-5">
        {/* Header: Icon + Title + Time (Editable) */}
        <div className="flex items-start gap-4 mb-3">
          <div className={`flex-shrink-0 mt-1 ${iconBoxClass}`}>
            {getIcon(activity.type)}
          </div>
          
          <div className="flex-1 min-w-0 pr-8">
            {isEditing ? (
              <div className="space-y-4 mb-2 animate-fade-in bg-notion-gray-bg p-4 rounded-md border border-notion-border">
                <div>
                   <label className="text-xs text-notion-gray font-bold uppercase block mb-1">標題</label>
                   <input 
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full text-lg font-bold text-notion-text border border-notion-border rounded px-3 py-2 bg-white"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs text-notion-gray font-bold uppercase block mb-1">預計時間</label>
                     <input 
                      type="text"
                      value={editedTime}
                      onChange={(e) => setEditedTime(e.target.value)}
                      className="w-full text-sm font-mono text-notion-gray border border-notion-border rounded px-3 py-2 bg-white"
                     />
                  </div>
                  <div>
                     <label className="text-xs text-notion-gray font-bold uppercase block mb-1">營業時間</label>
                     <input 
                      type="text"
                      value={editedOpeningHours}
                      placeholder="e.g. 09:00 - 22:00"
                      onChange={(e) => setEditedOpeningHours(e.target.value)}
                      className="w-full text-sm font-mono text-notion-gray border border-notion-border rounded px-3 py-2 bg-white"
                     />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between mb-1">
                   <h3 className="text-xl font-bold text-notion-text leading-tight">
                    {title}
                   </h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-notion-gray">
                  <div className="flex items-center font-mono font-medium">
                    <Clock size={14} className="mr-1.5" />
                    {time}
                  </div>
                  {openingHours && (
                    <div className="flex items-center font-medium bg-notion-gray-bg px-2 py-0.5 rounded text-xs">
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
        <div className="pl-[52px] mb-4 relative">
          {isEditing ? (
            <div className="mt-2 animate-fade-in">
              <label className="text-xs text-notion-gray font-bold uppercase mb-1 block">內容說明</label>
              <textarea 
                className="w-full text-base text-notion-text border border-notion-border rounded p-3 bg-white"
                rows={4}
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-4 pt-2">
                <button 
                  onClick={handleCancel}
                  className="text-sm text-notion-gray hover:text-notion-text px-3 py-1.5 rounded hover:bg-black/5"
                >
                  取消
                </button>
                <button 
                  onClick={handleSave}
                  className="text-sm font-bold text-white bg-notion-text hover:bg-black px-4 py-1.5 rounded"
                >
                  儲存
                </button>
              </div>
            </div>
          ) : (
            <div className="group/desc relative">
              <p className="text-base text-notion-text/80 leading-7 whitespace-pre-line">
                {description}
              </p>
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -top-1 -right-4 opacity-0 group-hover/desc:opacity-100 transition-opacity text-notion-gray hover:text-notion-text p-2"
                title="編輯"
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* --- GUIDE HIGHLIGHT SECTIONS (Monochrome) --- */}
        {!isEditing && (
          <div className="pl-[52px] space-y-3">
            
            {activity.reservationNote && (
              <div className="flex items-start p-3 border-l-2 border-notion-text bg-notion-gray-bg/30">
                <AlertCircle className="text-notion-text mr-2 mt-0.5 flex-shrink-0" size={16} />
                <div>
                  <div className="text-notion-text font-bold text-sm">重要預約</div>
                  <div className="text-notion-text text-sm font-mono mt-0.5">{activity.reservationNote}</div>
                </div>
              </div>
            )}

            {activity.mustTry && activity.mustTry.length > 0 && (
              <div className="flex items-start">
                <div className="mt-1 mr-2"><Star size={14} className="text-notion-text" fill="currentColor"/></div>
                <div>
                   <span className="text-sm font-bold text-notion-text mr-2">必吃推薦:</span>
                   <span className="text-sm text-notion-text/80 leading-6">
                      {activity.mustTry.join('、')}
                   </span>
                </div>
              </div>
            )}

            {activity.souvenirs && activity.souvenirs.length > 0 && (
              <div className="flex items-start">
                 <div className="mt-1 mr-2"><ShoppingBag size={14} className="text-notion-text" /></div>
                 <div>
                    <span className="text-sm font-bold text-notion-text mr-2">必買清單:</span>
                    <span className="text-sm text-notion-text/80 leading-6">
                        {activity.souvenirs.join('、')}
                    </span>
                 </div>
              </div>
            )}

            {activity.guideTips && (
               <div className="flex items-start bg-notion-gray-bg/50 p-3 rounded text-sm text-notion-text/80 italic">
                  <Info size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                  {activity.guideTips}
               </div>
            )}
          </div>
        )}

        {/* Footer: Tags & Action */}
        {!isEditing && (
          <div className="pl-[52px] flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-notion-border/50">
            {activity.tags?.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-xs font-medium bg-notion-gray-bg text-notion-text/70 border border-notion-border">
                #{tag.label}
              </span>
            ))}
            
            {activity.locationUrl && (
              <a 
                href={activity.locationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-auto flex items-center text-xs font-bold text-notion-text hover:underline bg-white px-3 py-1 rounded-full border border-notion-border hover:bg-notion-gray-bg transition-colors"
              >
                <Navigation size={12} className="mr-1.5" />
                地圖
              </a>
            )}
          </div>
        )}
        
        {/* Post-Visit Comments */}
        {!isEditing && (
          <div className="pl-[52px] mt-4">
            <div className="bg-notion-gray-bg/30 p-3 rounded-lg hover:bg-notion-gray-bg/60 transition-colors">
               <div className="flex items-start">
                  <MessageSquare size={14} className="mt-1 mr-3 text-notion-gray" />
                  <div className="flex-1">
                    <textarea
                        placeholder="筆記..."
                        value={comment}
                        onChange={handleCommentChange}
                        className="w-full text-sm text-notion-text bg-transparent border-none p-0 focus:ring-0 placeholder:text-notion-gray/40 resize-none"
                        rows={comment ? 2 : 1}
                    />
                  </div>
               </div>

               {/* Photo List */}
               {images.length > 0 && (
                 <div className="flex gap-2 overflow-x-auto pb-1 mt-2 pl-7">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group/img flex-shrink-0">
                        <img src={img} alt="User upload" className="h-16 w-16 object-cover rounded border border-notion-border" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute -top-1.5 -right-1.5 bg-white text-notion-text rounded-full p-0.5 shadow border border-notion-border opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                 </div>
               )}

               <div className="flex justify-start mt-1 pl-7">
                 <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="text-[10px] font-medium flex items-center text-notion-gray hover:text-notion-text transition-colors"
                 >
                   <ImageIcon size={10} className="mr-1" />
                   {images.length > 0 ? '加照片' : '新增照片'}
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
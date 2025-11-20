import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Initial mock data
const initialStories = [
  { id: 1, name: "New", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80", isViewed: false },
  { id: 2, name: "Sale", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80", isViewed: false },
  { id: 3, name: "Popular", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80", isViewed: true },
  { id: 4, name: "Gadgets", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&q=80", isViewed: true },
  { id: 5, name: "Fashion", image: "https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=150&q=80", isViewed: false },
];

export default function Stories() {
  const [stories, setStories] = useState(initialStories);
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newStory = {
        id: Date.now(),
        name: "My Story",
        image: imageUrl,
        isViewed: false
      };
      
      setStories([newStory, ...stories]);
      
      toast({
        description: "Istoriya qo'shildi! 📸",
      });
    }
  };

  const handleStoryClick = (story: typeof stories[0]) => {
    setSelectedStory(story);
    // Mark as viewed
    setStories(stories.map(s => s.id === story.id ? { ...s, isViewed: true } : s));
  };

  return (
    <>
      <div className="py-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 px-4 w-max">
          {/* Add Story Button */}
          <div 
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={handleAddClick}
          >
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 rounded-full bg-secondary border-2 border-background flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                  <Plus size={24} className="text-primary" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-background text-xs font-bold">
                +
              </div>
            </div>
            <span className="text-[10px] font-medium text-center">Add</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Stories List */}
          {stories.map((story) => (
            <motion.div 
              key={story.id}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => handleStoryClick(story)}
            >
              <div className={`p-[2px] rounded-full ${story.isViewed ? 'bg-border' : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'}`}>
                <div className="w-[60px] h-[60px] rounded-full border-2 border-background overflow-hidden">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-[10px] font-medium text-center truncate w-[60px]">{story.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button 
            onClick={() => setSelectedStory(null)}
            className="absolute top-4 right-4 text-white z-50 p-2"
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedStory.image} 
              alt={selectedStory.name} 
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute top-4 left-4 flex items-center gap-2">
               <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50">
                 <img src={selectedStory.image} className="w-full h-full object-cover" />
               </div>
               <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{selectedStory.name}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

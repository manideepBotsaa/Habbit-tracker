
import React, { useRef, useState } from 'react';
import { Camera, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureProps {
  onImageChange?: (image: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ onImageChange }) => {
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImage(imageUrl);
        onImageChange?.(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="relative mx-auto mb-4 h-20 w-20"
    >
      <div className="overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
        <div className="h-full w-full rounded-full bg-white p-1 dark:bg-gray-900">
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-gray-500" />
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-white hover:bg-primary/90"
      >
        <Camera className="h-4 w-4" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </motion.div>
  );
};

export default ProfilePicture;
